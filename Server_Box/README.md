## changement depuis la dernière version
server_box.js intègre toutes les fonctionnalités de :
- service.py
- postMyIp.py

l'objectif étant de lancer server_box.js au démarrage de la machine tout se fait automatiquement
Les différents fichiers supprimés sont : 
- service.py
- postMyIp.py
- local.py
- local.js

Remarque importante : 
Pour que la fonction postMyIp soit automatique, il faut renseigner

Before to launch server_box.js, indicate on MSERV_ADR variable, the adress mac of the rpi_cloud, in order to select correctly url depending of the developper (Jean-Baptiste, David)

List of npm install
- npm install nodemon
- npm install express
- npm install cors   
- npm install axios

To launch server_cloud

`nodemon server_box.js`





All Information below are obsolete:
## Service 

Before launch service, several packages must be installed like this :

`pip3 install flask flask_restful`

`pip3 install waitress`

`pip3 install pyopenssl`

We can launch service :

`python3 service.py`

GET /wifi
GET /leases


POST /wifi
{'command': 'desactivate'}
{'command': 'activate'}
POST /leases
{'command': 'route', 'ip':'192.168.1.12'}
{'command': 'unroute'}



## IP posting

In the first time, micro-service must be launched `python3 service.py` on the rpi_cloud. Then, we can activate the IP Posting by : 

`python3 postMyIp.py`

## Install Python Bluetooth

sudo apt install pkg-config libboost-python-dev libboost-thread-dev libbluetooth-dev libglib2.0-dev python-dev

`sudo apt-get install libbluetooth-dev`
`pip3 install pybluez`

wget https://files.pythonhosted.org/packages/fe/8d/72d539dd6be2d9677864a1
604b8db80696c2d5f018cf8093bf442311162f/gattlib-0.20201113.tar.gz
gzip -d gattlib-0.20201113.tar.gz
tar -xvf gattlib-0.20201113.tar
cd gattlib-0.20201113/
python3 setup.py build
sudo python3 setup.py install

sudo pip3 install bluepy

