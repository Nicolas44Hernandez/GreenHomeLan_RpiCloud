# GreenHoeLan

## 1. **Descriptif de la maquette GreenHomeLan**

Ce cas d'usage nécessite l'utilisation de 3 Raspberry Pi que l'on nomme de la façon suivante : 
- **rpi_camera** : Raspberry Pi jouant le rôle de la caméra
- **rpi_box** : Raspberry Pi jouant le rôle de la box
- **rpi_cloud** : Raspberry Pi jouant le rôle du cloud

**Petit descriptif topologique de la maquette :** 

La maquette est consituée 2 réseaux fonctionnement quasiment en parallèle. Un réseau IP et un réseau BLE

- Le réseau IP est composé de deux réseaux :
    - Un réseau WAN correspondant au réseau du domicile
    - Un réseau LAN correspondant au monde extérieure (monde internet)  
- le rpi_camera et rpi_box sont les composants du réseau WAN
- le rpi_box est configuré comme un point d'accès sur lequel se connecte le rpi_camera par wifi
- le rpi_box est également connecté au réseau LAN (internet)
- le rpi_cloud est hors du périmètre du WAN domicile et appartient exclusivement au réseau LAN
- Le rpi_box joue donc le rôle d'un routeur réalisant le pont entre les 2 réseaux LAN et WAN

Le réseau BLE est composé de 3 éléments:
- un bouton BLE (périphérique) 
- un élément central BLE connecté au rpi_camera
- un périphérique BLE connecté au rpi_box

Etat initial de la démo
- Le rpi_camera et rpi_box ont leur wifi éteint. le WAN du domicile est donc inopérant
- Dès que le bouton BLE est actionné, un message BLE est envoyé récupéré par le central BLE du rpi_camera qui le répercute au périphérique BLE du rpi_box
- A la réception de ce message, le rpi_box et rpi_camera activent tout deux leur WiFi formant ainsi un réseau WAN fonctionnel
- A la création du WAN, le rpi_camera envoie son flux vidéo qui est routé par le rpi_box vers le LAN Ethernet
- le rpi_cloud récupère le flux et en tant que serveur propose une appli web sur le quel un pc connecté dessus pourra visualiser le flux vidéo

## 2. **Installation des raspberry pi**

La procédure d'installation et de lancement des serveurs pour chaque raspberry pi sont détaillés dans les répertoires associés.
- [Server_Box](Server_Box)
- [Server_Camera](Server_Camera)
- [Server_Cloud](Server_Cloud)
## 3. **Mise en place du réseau BLE**

Cette partie vie à décrire comment réaliser un réseau BLE constitué de 3 composants. Chaque composant BLE nécessite un montage particulier (décrit ci-dessous). Voic la liste des éléments à posséder pour réaliser les 3 montages:   
- 3 cartes arduino MKR WiFI 1010 
- 3 platine d'essai
- des résistances dont la valeur peut être comprise entre 100 ohms et 1000 ohms
- un lot de led rouges et jaunes
- 3 câbles USB / micro USB (un pour chaque montage)


### **Descriptif des montages**
#### **Montage arduino du central BLE relié au rpi_camera**
![imageBleCamera](Reseau_Aduino_%20BLE/Schema_BLE_Camera.JPG)
#### **Montage arduino du périphérique BLE relié au rpi_box**
![ImageBleBox](/Reseau_Aduino_%20BLE/Schema_BLE_Box.JPG)
#### **Montage arduino du bouton BLE avec bouton poussoir**
![ImageBleButton](Reseau_Aduino_%20BLE/Schema_BLE_Bouton.JPG)

### **Configuration logicielle des cartes Arduino**

Ci-dessous est décrit une liste d'action pour finaliser le réseau BLE

- Installation du [logiciel arduino](https://www.arduino.cc/en/software) 
- **Installation de la carte** : 
    - Au niveau du logiciel : outils > Type de carte > Gestionnaire de cartes > Arduino SAMD Boards à installer
- **Choix de la carte** : 
    - Au niveau du logiciel : outils > Type de carte > Arduino SAMD Boards > Arduino MKR Wifi 1010
- Brancher les 3 montages sur le PC via les câbles USB
- Déterminer le port COM correspondant à la connection du montage sur PC
- Téléverser le programme appropié pour chaque montage
    - Central_Ghl dans à montage relié au rpi_camera
    - Detection_Ghl_Button au montage avec button poussoir
    - Detection _Ghl_Web au montage rélié au rpi_box