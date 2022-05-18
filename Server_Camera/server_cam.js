const bodyParser = require('body-parser');
const express = require('express');
const {createServer} = require("http");
const {Server} = require("socket.io");
const exec = require('child_process').exec;
const Gpio = require('onoff').Gpio;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const port = 4000;
const button = new Gpio(6, 'in', 'rising', {debounceTimeout: 20});
const web = new Gpio(26, 'in', 'rising', {debounceTimeout: 20});
const wifi_pin = new Gpio(14, 'out');

httpServer.listen(port);

app.use(express.static(__dirname + '/www'));
app.use(bodyParser.urlencoded({
    limit: '200mb',
    extended: true
}))

button.watch((err, value) => {
    console.log('appui sur bouton BLE pour activer le wifi du rpicam');
    setWifiOn('button');
}); 

process.on('SIGINT', _ => {
    button.unexport();
});

web.watch((err, value) => {
    console.log('appui sur web BLE pour activer le wifi du rpibox')
    setWifiOn('web');
}); 

process.on('SIGINT', _ => {
    web.unexport();
});

function initServer(){
    console.log('Init Server');
    setWifiOff();
}

async function setWifiOn(type_command){
    let command = `sudo service hostapd start`;
    wifi_pin.writeSync(1);
    exec(command);
    if (type_command == "button"){
        console.log("wifi on by button");
    }
    if (type_command == "web"){
        console.log("wifi on by web");
    }
    
}

async function setWifiOff(){
    let command = `sudo service hostapd stop`;
    console.log("       Command to stop Wi-Fi");
    wifi_pin.writeSync(0);
    exec(command);
    console.log("       LED Wi-Fi is off");
    console.log("       Wi-FI is off");
}

class ServerData {
    constructor() {
        this.last_frame = undefined;
    }
   
    frame_data(req, res) {
        this.last_frame = req.body.data;
        //console.log("Got frame data 1: " + this.last_frame + " bytes");
        res.end()
    }

    get_frame(req, res) {
        if (this.last_frame != undefined) {
            res.end(this.last_frame);
            this.last_frame = undefined;
        }
    }
}

const server = new ServerData();

app.post("/frame_data", function(req, res) {
    
    server.frame_data(req, res);
});

app.get("/get_frame", (req, res) => {
    server.get_frame(req, res);
});

app.get("/closewifi", (req, res) => {
    console.log("---> Receive GET /closewifi from box to shutdown wifi");
    setWifiOff();
    res.send('Wi-Fi of camera is off');
    console.log("<--- Send response GET /closewifi to box : Wi-FI is off");
});

initServer();