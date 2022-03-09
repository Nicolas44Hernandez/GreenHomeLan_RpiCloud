
Se placer dans le répertoire 
camera/Server_Camera 

lancer les commandes suivantes
```
python3 captureVideo.py

node server.js

node server2.js

```

Pour forcer l'usage du wifi
`sudo ifconfig eth0 down`

## Commandes utiles

Lister l'état des interface radio

`rfkill list`



### Wifi 

Lancer le client wifi

`wpa_supplicant -B -c/etc/wpa_supplicant/wpa_supplicant.conf -iwlan0 -Dnl80211,wext`


### Bluetooth

Connaître l'état du service bluetooth:
`sudo service bluetooth status`

Utiliser le bluetooth en ligne de commande
```
sudo bluetoothctl
power on
scan on
```

Connaître l'état de l'interface Bluetooth
`sudo hciconfig hci0`

