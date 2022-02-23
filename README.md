# Camera

# Cas d'usage : Camera


## 1. **Descriptif du cas d'usage**

Ce cas d'usage nécessite l'utilisation de 3 Raspberry Pi que l'on nomme de la façon suivante : 
- **rpi_camera** : Raspberry Pi jouant le rôle de la caméra
- **rpi_box** : Raspberry Pi jouant le rôle de la box
- **rpi_cloud** : Raspberry Pi jouant le rôle du cloud
Un élément supplémentaire est le bouton BLE qui est simulé par le Arduino MRK WiFi 1010 intégrant une puce BLE

Petit descriptif topologique du cas d'usage
- La démo présente deux réseaux
    - réseau WAN entièrement en wifi jouant le rêle de réseau du domicile
    - réseau LAN par Ethernet jouant le rôle du monde extérieure (monde internet)  
- le rpi_camera et rpi_box sont les composants du réseau WAN
- le rpi_box est configuré comme un point d'accès sur lequel se connecte le rpi_camera par wifi
- le rpi_box est également connecté au réseau LAN internet
- le rpi_cloud est hors du périmètre du WAN domicile et appartient exclusivement au réseau LAN internet
- Le rpi_box joue le rôle d'un routeur réalisant le pont entre les 2 réseaux
- le bouton BLE envoie seulement des message BLE seulement captés par le rpi_box et rpi_camera

Etat initial de la démo
- le rpi_camera et rpi_box ont leur wifi éteint. le WAN du domicile est donc inopérant
- dès que le bouton BLE est activé, un message BLE est envoyé en mode broadcast
- les rpi_camera et rpi_box jouent le rôle d'observateur Bluetooth et dès qu'ils reçoivent un message du bouton BLE, ils vont tous deux activer leur WiFi respectifs, formant ainsi un réseau WAN fonctionnel
- A la création du WAN, le rpi_camera envoie son flux vidéo qui est routé par le rpi_box vers le LAN Ethernet
- le rpi_cloud récupère le flux et en tant que serveur propose une appli web sur le quel un pc connecté dessus pourra visualiser le flux vidéo

## 2. **Procédure d'installation et de configuration**

### **Installation des OS sur les Raspberry Pi**

Afin de faciliter l'accès au dépôt et de bénéficier des derniers correctif, il est judicieux de prendre la dernière version de raspbion OS (Bullseye). Cependant cette dernière version a profondément modifier la partie logicielle gérant la caméra. C'est pourquoi, et seulement pour la rpi_camera, il est indispensable d'installer la dernière version Buster.
- Pour rpi_box et rpi_cloud : [raspios_lite_Bullseye](https://downloads.raspberrypi.org/raspios_lite_armhf/images/raspios_lite_armhf-2021-11-08/)
- Pour rpi_camera : [raspios_lite_Buster](https://downloads.raspberrypi.org/raspios_lite_armhf/images/raspios_lite_armhf-2021-05-28/)

flasher ces images raspios_lite sur les cartes sd se fait par l'outil Etcher : https://www.balena.io/etcher/

Par la suite, une procédure d'installation est proposé pour configurer l'ensemble des raspberry pi. Il est important de suivre l'ordre de chaque commande.

### **configuration SSH et Camera**

Pour accéder aux commandes du raspberrypi, nous avons par défaut (dentifiant : pi et mot de passe : raspberry)


Il est possible de changer le mot de passe (non expliqué dans ce document)
Ensuite, il est important d'activer l'option ssh qui est désactivé par défaut. De même pour le rpi_camera, il faut activer le mode camera.
Pour cela:

`sudo raspi-config`

Il est aisé de trouver les options ssh et camera à activer. Puis redémarrer par 

` sudo reboot`

A noter qu'il faut absolument que le rpi_box reste connecté par Ethernet

Pour un clavier en mode azerty, on peut le configurer de la manière suivante :

    sudo nano /etc/default/keyboard			

puis modifier la ligne XKBLAYOUT="gb" par XKBLAYOUT="fr"						


### **Installation des packages pour pour les 3 rpi**

Nous allons ici installer les paquets issues de dépot linux utiles et communs au 3 raspberrypi

    sudo apt update
    sudo apt upgrade
    sudo apt install python3-pip
    sudo apt install dnsmasq
    sudo apt install iptables

### **Installation et configuration du rpi_box en tant que point d'accès wifi**

```
sudo apt install hostapd			
sudo systemctl unmask hostapd					
sudo systemctl enable hostapd					
sudo DEBIAN_FRONTEND=noninteractive apt install -y netfilter-persistent iptables-persistent					
sudo reboot	
```				
Attribution d'une adresse statique

`sudo nano /etc/dhcpcd.conf`

à copier/coller ces 3 lignes de code ci-dessous avec ctr+s pour enregsitrer et ctr+x pour sortir

```
interface wlan0
    static ip_address=192.168.4.1/24
    nohook wpa_supplicant
```

Le rpi_box aura donc une adresse ip fixe wifi dont l'adresse est : 192.168.4.1 en plus de son adresse Ethernet. On peut le vérifier par la commande: 

`sudo ifconfig`

où etho et wlan0 on chacun une adresse ip attribué avec wlan0 valant 192.168.4.1

Ensuite, il faut activer le routage	

`sudo nano /etc/sysctl.d/routed-ap.conf`
ou plutôt `/etc/sysctl.conf` ??
en copiant/collant cette ligne

```
net.ipv4.ip_forward=1				
```

Pour rediriger le traffic HTTP vers le rapsberry pi Box

`sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 4000 -m conntrack --ctstate NEW -j DNAT --to 192.168.4.12:4000`

`sudo iptables -t nat -A PREROUTING -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT`

Puis les 2 commandes suivantes pour finaliser le routage

`sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE`

Pour rendre les règles de routage persistente:

`sudo netfilter-persistent save`	


Ensuite, on configure les services DHCP et DNS

`sudo mv /etc/dnsmasq.conf /etc/dnsmasq.conf.orig`
`sudo nano /etc/dnsmasq.conf`

à copier coller les 4 lignes ci-dessous dans le fichier	

```
interface=wlan0
dhcp-range=192.168.4.2,192.168.4.20,255.255.255.0,300d
domain=wlan
address=/gw.wlan/192.168.4.1
```

Enfin pour finir la configuration du point d'accès, on configure les paramètres réseau en proposant un nom de réseau et un mot de passe		

`sudo nano /etc/hostapd/hostapd.conf`

copier coller les lignes ci-dessous
```    
interface=wlan0
driver=nl80211
ssid=rpibox
hw_mode=g
channel=7
macaddr_acl=0
wmm_enabled=1
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_passphrase=greenhomelan
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP
country_code=FR
```

Puis on indique l'emplacement de la configuration

`sudo nano /etc/default/hostapd`

```
DAEMON_CONF="/etc/hostapd/hostapd.conf"
```



Avant de redémarrer le raspberrypi

`sudo reboot`

Le point d'accès de la rpi_box sera maintenant visile par `rpibox` avec comme mot de passe `greenhomelan` 
(un autre mot de passe est possible du moment qu'il est renseigné dans le fichier hostapd.conf)


### **Installation de la bibliothèque cv2 pour le rpi_camera**

La bibliothèque cv2 de python est indispensable pour la transmission de la vidéo au raspberrypi voisin. L'installation de cette bibliothèque est assez complexe 
et il est utile d'en décrire les différentes étapes : 

le site : https://qengineering.eu/install-opencv-lite-on-raspberry-pi.html présente les détails de l'installation à suivre à la lettre.

Ensuite, il reste les commandes suivantes : 

    sudo pip3 install opencv-python			
    sudo apt install libatlas3-base			
    sudo pip3 install -U numpy

Afin de tester la bonne installation de cv2, testons son import : 

    python3
    import cv2

Si aucune message d'erreur est visible, la procédure s'est alors bien passée.

### **Configuration de la connexion Wifi pour le rpi_camera**

Cette partie vise à configurer la connexion Wifi du rpi_camera, afin qu'elle ne puisse se connecter seulement au rpi_box, créant ainsi le réseau wan
du domicile comme expliqué au début de cette documentation.
Si le rpi_camera est branché sur ethernet, il faudra ensuite le déconnecté. Par la suite le ssh est possible sur ce rpi_camera a condition de 
connecter son pc sur le point d'accès rpi_box. Sur ce point d'accès, il est possible d'accéder à tous les raspberrypi.
			
`sudo nano /etc/network/interfaces`	 
à copier coller		
```
auto lo		
iface lo inet loopback		
allow-hotplug wlan0 		
auto wlan0		
wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf
```

ensuite : 

`sudo nano /etc/wpa_supplicant/wpa_supplicant.conf`

à copier / coller	

```
network={
ssid="rpibox"
psk="greenhomelan"
proto=RSN
key_mgmt=WPA-PSK
pairwise=CCMP
auth_alg=OPEN
}		
```
Après un reboot du rpi_camera, ce raspberrypi se connectera automatiquement en wifi sur le rpi_box

### **Configuration des 3 serveurs Rapsberry**

Pour cela, il faut récupérer le code associé à chaque Rapsberry dans un répertoire dédié

Nous allons maintenant pour chaque raspberrypi, installez les dépendances suivantes comme voici:

Dans le répertoire Server_Box du rpi_box : 

```
npm install express
npm install socket.io
npm install socket.io-client
```
Modifier la ligne 13 de index.js en renseignant l'adresse IP rpi_camera

Dans le répertoire Server_Camera du rpi_camera : 

```
npm install express
npm install socket.io
npm install body-parser
npm install socket.io-client
python3 -m pip install requests
```

Modifier la ligne 18 de main.py en renseignant l'adresse IP rpbi_camera

Dans le répertoire Server_Cloud du rpi_cloud :

```
npm install express
npm install socket.io
npm install socket.io-client
```
Modifier la ligne 13 de main.js en renseignant l'adresse IP rpi_box

### **Création et démarrage d'un service pour les 3 raspberrypi**

L'ensemble des programmes étant installé, il faut que ces programmes puissent démarrer automatiquement au démarrage de chaque raspberrypi. 

Voici la précédure à suivre pour configurer un deamon :

#### **Pour rpi_box :**

`sudo nano /etc/rc.local`

à copier /coller

```
sudo node server.js & python3 BleStartWifi.py
```

#### **Pour rpi_camera :** 

`sudo nano /etc/rc.local`

à copier /coller

```sudo node main.js & python3 main.py & python3 observerBLE.py```

#### **Pour rpi_box :**

`sudo nano /etc/rc.local``
à copier /coller

```
node index.js
```

#### Pour les 3 raspberrypi : 

`sudo chmod +x /etc/rc.local`							
`sudo nano  /etc/systemd/system/rc-local.service `

```
[Unit]						
Description=/etc/rc.local Compatibility						
ConditionPathExists=/etc/rc.local						
After=bluetooth.target						
Requires=bluetooth.target						
                        
[Service]						
Type=forking						
ExecStart=/etc/rc.local start						
TimeoutSec=0						
StandardOutput=tty						
RemainAfterExit=yes						
SysVStartPriority=99						
                        
[Install]						
WantedBy=multi-user.target					
```

    sudo nano /etc/rc.local à copier /coller juste avant la ligne exit 0
        python3 /home/pi/<chemin repetoire>/BleStartWifi.py &
`sudo systemctl enable rc-local.service`
`sudo systemctl start rc-local.service`


    sudo chmod +x /etc/rc.local							
    sudo nano  /etc/systemd/system/rc-local.service  (copier/coller la partie ci-dessous)
        [Unit]						
        Description=/etc/rc.local Compatibility						
        ConditionPathExists=/etc/rc.local						
        After=bluetooth.target						
        Requires=bluetooth.target						
                                
        [Service]						
        Type=forking						
        ExecStart=/etc/rc.local start						
        TimeoutSec=0						
        StandardOutput=tty						
        RemainAfterExit=yes						
        SysVStartPriority=99						
                                
        [Install]						
        WantedBy=multi-user.target

Puis on lance le service : 

    sudo systemctl enable rc-local.service	
    sudo systemctl start rc-local.service	
Pour voir si le service est correctement actif, taper la commande suivante : 

`sudo systemctl status rc-local.service`




