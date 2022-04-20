const express = require('express')
const axios = require('axios')
const fs = require('fs');
const cors = require('cors');
const exec = require('child_process').exec;
const util = require("util");
const { clear } = require('console');
const Gpio = require('onoff').Gpio; 


const app = express()
const execProm = util.promisify(exec);
const DELAY = 5000
const port = 8008
let arpInterval;

const MSERV_ADR   = {
    "e4:5f:01:0e:34:3f" : "http://192.168.1.29:8000",
    "e4:5f:01:0e:31:ed" : "http://172.16.57.127:8000"}

let stopTable = false;
let timer;

app.use(cors());


const button = new Gpio(26, 'in', 'rising', {debounceTimeout: 20});
button.watch((err, value) => {
    console.log('appui sur bouton BLE pour activer le wifi du rpibox')
    setWifiOn() 
}); 

process.on('SIGINT', _ => {
    button.unexport();
});

async function setWifiOn(){
    let command = `sudo service hostapd start`
    exec(command);
    console.log("wifi on");
    notifyMyWifi();
    arpInterval = setInterval(checkConnection, 250)
}

async function setWifiOff(){
    let command = `rfkill block wifi` 
    await execProm(command);
    command = `rfkill list wifi`
    let out = await execProm(command);
    return out["stdout"].split('\n')[1].includes('yes')
}
 

function postMyIp(){
    getMyMacAdress().then(mac => {
        let url_cloud = MSERV_ADR[mac] + "/boxes_ip";
        console.log(url_cloud)
        getMyIp().then(my_ip => {
            axios.post(url_cloud, {
                ip: my_ip,
                name:"rpi_box"
              })
        }); 
    });           
}
function notifyMyWifi(){
    getMyMacAdress().then(mac => {
        let url_cloud = MSERV_ADR[mac] + "/notify_wifi";
        console.log(url_cloud)
        getMyIp().then(my_ip => {
            axios.post(url_cloud, {
                ip: my_ip,
                name:"rpi_box"
              })
        }); 
    });          
}
async function getMyIp(){
    let command = ` ifconfig | awk '/^eth0/ { iface = $1; getline; sub("addr:", ""); print iface, $1, $2 }'`
    let out = await execProm(command);
    return out["stdout"].split(' ')[2].replace('\n',''); 
}
 
async function getMyMacAdress(){
    let command = `arp -a | cut -d' ' -f 4`
    let out = await execProm(command);
    let list_mac = out["stdout"].split('\n')
    for (let mac of list_mac){
        if (MSERV_ADR[mac] !== undefined){
            return  mac
        }
    }
}

function checkConnection(){     // 
    console.log('check connection')
    let command = `awk '$4~/[1-9a-f]+/&&$6~/^wl/{print "ip: "$1" mac: "$4}' /proc/net/arp`;
    let out = exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        if(stdout){
            clearInterval(arpInterval);
            console.log(`Connexion établie`);
            sendRequestForSms()  // Envoie un POST Contact SMS user tel
        }
    });
}

function sendRequestForSms(){
    getMyMacAdress().then(mac => {
        let url_cloud = MSERV_ADR[mac] + "/sms";
        console.log(url_cloud)
        axios.get(url_cloud)
        .then((res) => {
            console.log(res.data);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
          })
    });
} 

async function getArpConnected() { 
    let result;
    let temp;
    let command = `awk '$4~/[1-9a-f]+/&&$6~/^wl/{print "ip: "$1" mac: "$4}' /proc/net/arp`;
    temp = await execProm(command);
    temp = temp["stdout"].split('\n')[0].split(" ") 
    result = JSON.stringify({ mac : temp[3], ip : temp[1]});
    return result;
}

async function createNatPreroutingRules(targetIp){
    let command = `sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 4000 -m conntrack --ctstate NEW -j DNAT --to ${targetIp}:4000`
    console.log(command)
    await execProm(command);
    command = `sudo iptables -t nat -A PREROUTING -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT`
    console.log(command)
    await execProm(command);
} 

async function removeRules(){
    let temp
    let command
    let nb_delete
    console.log("Deleting routing rules from iptables");
    command = "sudo iptables --line-numbers --list PREROUTING -t nat"
    temp = await execProm(command);
    nb_delete = temp.stdout.split("\n").length - 3
    for (let i = 0; i < nb_delete; i++) {
        let command = "sudo iptables -t nat -D PREROUTING 1"
        await execProm(command);
    }
}

async function serviceHostapd(cmd){
    let command 
    if (cmd == "activate")
        command = `sudo service hostapd start`;
    else 
        command = `sudo service hostapd stop`;
    console.log(command)
    await execProm(command);
}

function setStopListener() {
    const stopListener = () => {
        if (stopTable) {
            stopTable = false;
            removeRules()
        }
        return setTimeout(stopListener, 250);
    };
    stopListener();
}

app.get('/wifi', (req, res) => {
    if (fs.existsSync("/run/hostapd.pid"))
        res.send(JSON.stringify({"etat":"active"}))
    else
        res.send(JSON.stringify({"etat":"inactive"}))
});

app.post('/wifi', (req, res) => {
    let state
    serviceHostapd(req.query.command)
    console.log(req.query.command)
    if (req.query.command == "activate"){
        stopTable = false
        state = {'etat':'active'}
    }
    else{
        stopTable = true
        state = {'etat':'inactive'}
    }
    console.log(state)
    res.send(JSON.stringify(state))
});

app.get('/leases', (req, res) => {
    getArpConnected().then( r => {
        res.send(r)} 
    );
});

app.post('/leases', (req, res) => {
    let lease_ip = req.query.ip;
    let command = req.query.command;
    if(command=='route'){
        createNatPreroutingRules(lease_ip).then( () => {
            res.send( `{"status":"routed", "ip":"${lease_ip}"}`);
        });
    }else{
        removeRules();
        stopTable = false;
        res.send('{"status":"unrouted"}');
    }
});


app.post('/ping', (req, res) => {
    clearTimeout(timer);
    timer = setTimeout(() => stopTable = true, DELAY);
    res.send('{"ping":"pong"}')
}); 

app.listen(port, () => {
    console.log(`Server cloud listening on port ${port}`)
});

setStopListener();
postMyIp()