# **Partie Cloud : Procédure d'installation et de configuration**

## **1. Installation de l'OS Raspbian sur rapsberry**
Nous allons installer un OS au raspebrry pi simulant le cloud. Dans toute la procédure, ce raspberry pi sera nommé rpi_cloud.
Afin de faciliter l'accès au dépôt et de bénéficier des derniers correctifs de l'OS raspbian, il est judicieux de prendre la dernière version Bullseye. 
- [raspios_lite_Bullseye](https://downloads.raspberrypi.org/raspios_lite_armhf/images/raspios_lite_armhf-2022-04-07/)


Flasher l'image raspios_lite sur la cartes sd du raspberry via l'outil Etcher : https://www.balena.io/etcher/

## **2. Configuration de l'OS Raspbian**

Connectez le rpi_cloud par par Ethernet et branchez y un clavier, et un écran via le port HDMI.
Pour accéder aux commandes du raspberrypi, nous avons laissé par défaut (dentifiant : pi et mot de passe : raspberry)


Il est possible de changer le mot de passe (non expliqué dans ce document). Déterminez l'adresse IP du rpi_box par la commande

`ifconfig`

Notez le. Ensuite, il est important d'activer l'option ssh (désactivé par défaut). Pour cela:

`sudo raspi-config`

Puis activer l'option ssh et  redémarrer par 

` sudo reboot`

Par la suite, l'écran et le clavier ne sont plus utiles. On peut se connecter par SSH via l'outil Putty en indiquant l'adresse ip préalabelement récupérée.

Une fois connecté en  SSH, il est utile si cela est nécessaire, de changer le clavier en mode azerty, on peut le configurer de la manière suivante :

`sudo nano /etc/default/keyboard`			

puis modifier la ligne XKBLAYOUT="gb" par XKBLAYOUT="fr"

## **3. Installation du serveur Nodejs**

Dans un premier temps, il faut récupérer le répertoire sur GitHub:

`git clone git@github.com:clemanthkar/GreenHomeLan_Camera.git`

Aller dans le répertoire GreenHomeLan/Server_Cloud qui correspond à notre environnement de travail pour le rpi_cloud. Installer les dépendances suivantes:

`npm init` (valider chaque lignes)

 Puis installation des toutes les dépendances : 

`npm i express`

`npm i axios`

`npm i cors`

`npm i nodemailer`

`npm i socket.io`

Pour lancer le serveur cloud : 

`node server_cloud.js`

Au préalable pour faciliter la découverte entre le rpi-cloud et rpi-box, il est utile d'effectuer un ping sur l'adresse du rpi-box
## **4. Accès au Site Web**

Une application web est gérer par le server_cloud.js que l'on peut accéder sur un navigateur web par l'adresse suivante : 
```
http://<ip_rpi-cloud>:8000/
```
