## **Install dependencies**

```bash
npm install
```

## **Set the rpi-camera application as a service**

Copy the service file
```bash
sudo cp server/service/rpi-cloud.service /etc/systemd/system/
```

Register service
```bash
sudo systemctl daemon-reload
sudo systemctl enable rpi-cloud
sudo systemctl restart rpi-cloud
```
TODO: UPDATE