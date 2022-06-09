# GreenHoeLan

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

## 2. **Installation des raspberry pi**

La procédure d'installation et de lancement des serveurs sir chaque raspberry pi sont détaillés dans les répertoires associés.
## 3. **Mise en place du réseau BLE**

Réaliser un réseau BLE constitué de 3 composants. Chaque composant nécessite un montage particulier (décrit ci-dessous). Voic la liste des éléments à posséder :   
- 3 cartes arduino MKR WiFI 1010 
- 3 platinse d'essai
- des résistances dont la valeurs peut être comprise entre 100 ohms et 1000 ohms
- un lot de led rouges et jaunes
- 3 câble USB / micro USB (un pour chaque montage)


### **Descriptif des montages**
#### **Montage arduino BLE relié au rpi_camera**
![imageBleCamera](Reseau_Aduino_%20BLE/Schema_BLE_Camera.JPG)
#### **Montage arduino BLE relié au rpi_box**
![ImageBleBox](/Reseau_Aduino_%20BLE/Schema_BLE_Box.JPG)
#### **Montage arduino BLE avec bouton poussoir**
![ImageBleButton](Reseau_Aduino_%20BLE/Schema_BLE_Bouton.JPG)

### **Configuration logicielle**

- Installation du [logiciel arduino](https://www.arduino.cc/en/software) 
- **Installation de la carte** : outils > Type de carte > Gestionnaire de cartes > Arduino SAMD Boards à installer
- **Choix de la carte** : outils > Type de carte > Arduino SAMD Boards > Arduino MKR Wifi 1010
- Branchement des 3 montages sur le PC via les câbles USB
- Déterminer le port COM correspondant à la connection du montage sur PC. 
- Téléverser le programme appropié pour chaque montage
    - Central_Ghl dans à montage relié au rpi_camera
    - Detection_Ghl_Button au montage avec button poussoir
    - Detection _Ghl_Web au montage rélié au rpi_box