
# RPI Cloud

# OS installation
You can use the [Raspberry Pi Imager](https://www.raspberrypi.com/software/) to flash the last 64-bit Bullseye ligth version (no desktop)


# Initial setup

Use raspi-config to configure the RPI
```bash
sudo raspi-config
```
- Configure the camera interface
- Configure the SSH interface
- Connect to your Wi-Fi network (you must have an internet connection)

## Update OS

```bash
sudo apt update
sudo apt upgrade
```

## Install and configure git

```bash
sudo apt install git
git config --global user.name "Nicolas44Hernandez"
git config --global user.email n44hernandezp@gmail.com
```

## Create and add ssh key to your github account

Complete ssh key setup is explained in the following [link](https://docs.github.com/es/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)

## Clone rpi_cloud repository

```bash
mkdir workspace
git clone git@github.com:Nicolas44Hernandez/GreenHomeLan_RpiCloud.git
```

## Install the dependencies
```bash
npm install
```

## **Set the rpi-cloud application as a services**

Copy the service file
```bash
sudo cp service/rpi-cloud.service /etc/systemd/system/
sudo cp service/rpi-cloud-large.service /etc/systemd/system/
```

Register service
```bash
sudo systemctl daemon-reload
sudo systemctl enable rpi-cloud
sudo systemctl enable rpi-cloud-large
sudo systemctl restart rpi-cloud
sudo systemctl restart rpi-cloud-large
```