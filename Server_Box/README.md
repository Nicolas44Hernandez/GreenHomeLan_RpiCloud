


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

