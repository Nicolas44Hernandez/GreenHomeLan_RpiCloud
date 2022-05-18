const express = require('express')
const axios = require('axios');
const cors = require('cors');
const exec = require('child_process').exec;
const util = require("util");
const Gpio = require('onoff').Gpio;
const config = require('./config');

const web_test = new Gpio(26, 'in', 'rising', {debounceTimeout: 20});
const button = new Gpio(6, 'in', 'rising', {debounceTimeout: 20});
const wifi_pin = new Gpio(14, 'out');

const app = express()
const execProm = util.promisify(exec);

let arpIntervalConnect;
let arpIntervalDisconnect;
let wifi_on = false;
let stopTable = false;

app.use(cors());

web_test.watch((err, value) => {
    console.log('appui sur web BLE pour activer le wifi du rpibox');
}); 

process.on('SIGINT', _ => {
    web_test.unexport();
});

 
button.watch((err, value) => {
    console.log('appui sur bouton BLE pour activer le wifi du rpibox');
    setWifiOn('button') ;
}); 

process.on('SIGINT', _ => {
    button.unexport();
});

async function setWifiOn(type_command){
    let command = `sudo service hostapd start`;
    exec(command);
    console.log("       Command to start Wi-Fi");
    wifi_on = true;
    notifyMyWifi();
    wifi_pin.writeSync(1);
    console.log("       LED BOX is ON");
    console.log('       Check connection between camera and box');
    if (type_command == "button"){
        console.log("wifi on by button");
        arpIntervalConnect = setInterval( function() { checkConnection(true); }, config.delay );    // true indique qu'il faut envoyé un email
    }
    if (type_command == "web"){
        console.log("       Setup Wi-FI at on by Web");
        arpIntervalConnect = setInterval( function() { checkConnection(false); }, config.delay );   // false indique qu'il ne faut pas envoyé d'email
    }
}

async function setWifiOff(){
    let command = `sudo service hostapd stop`;
    exec(command);
    console.log("       Command to stop Wi-Fi");
    wifi_on = false;
    notifyMyWifi();
    wifi_pin.writeSync(0);
    console.log("       LED BOX is OFF");
    console.log('       Check disconnection between camera and box');
    arpIntervalDisconnect = setInterval(checkDisconnection, config.delay);
}
 
function postMyIp(){
    console.log('-----------------------------------------> Post My Ip box to Cloud')
    getMyMacAdress().then(mac => {
        let url_cloud = config.MSERV_ADR[mac] + "/boxes_ip";
        getMyIp().then(my_ip => {
            console.log("---> Send POST /boxes_ip to cloud to inform the box information" + url_cloud);
            axios.post(url_cloud, {
                ip: my_ip,
                name:"rpi_box"
              }).then((res) => {
                console.log('<--- Response to POST /boxes_ip by cloud where information received is : ' + JSON.stringify(res.data));
            })
            .catch(function (error) {
                console.log(error);
            });
        }); 
    });           
}
 
function notifyMyWifi(){    // A vérifier si utile
    getMyMacAdress().then(mac => { 
        let url_cloud = config.MSERV_ADR[mac] + "/notify_wifi";
        console.log("---> Send POST /notify_wifi to Cloud");
        axios.post(url_cloud, {
            status: wifi_on
            }).then((res) => {
            console.log('<--- Response to POST /notify_wifi by cloud where wifi is : ' + wifi_on);
        }) 
        .catch(function (error) { 
            console.log(error);
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
        if (config.MSERV_ADR[mac] !== undefined){
            return  mac
        }
    }
} 

function checkConnection(bool){     // 
    console.log('       Check connection in progress .....');
    let command = `awk '$4~/[1-9a-f]+/&&$6~/^wl/{print "ip: "$1" mac: "$4}' /proc/net/arp`;
    exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        if(stdout){
            console.log(stdout);
            clearInterval(arpIntervalConnect);
            console.log(`       Connexion between Box and Camera is on` + stdout);
            console.log(` `);
            if(bool) sendRequestForEmail() ;
        }
    });
}

function checkDisconnection(){     // 
    console.log("       Check disconnect in progress .....")
    let command = `awk '$4~/[1-9a-f]+/&&$6~/^wl/{print "ip: "$1" mac: "$4}' /proc/net/arp`;
    exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        if(!stdout){
            clearInterval(arpIntervalDisconnect);
            console.log(`       Connexion between Box and Camera is out`);
            console.log(` `);
        }
    });
}

function sendRequestForEmail(){
    getMyMacAdress().then(mac => {
        let url_cloud = config.MSERV_ADR[mac] + "/email";
        console.log("---> Send GET /email to Cloud to send an email");
        axios.get(url_cloud)
        .then((res) => {
            console.log("<--- Response to GET /email by CLoud  : " + res.data);
        })
        .catch(function (error) {
            console.log(error);
        });
    });
}   
 
function getArpConnected() { 
    let result;
    let temp;
    let command = `awk '$4~/[1-9a-f]+/&&$6~/^wl/{print "ip: "$1" mac: "$4}' /proc/net/arp`;
    exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        if(stdout){
            console.log(stdout)
            temp = stdout.split('\n')[0].split(" ");
            result = JSON.stringify({ mac : temp[3], ip : temp[1]});
            return result;
        }
    });
}

async function getArpConnectedAsync() { 
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
    await execProm(command);
    command = `sudo iptables -t nat -A PREROUTING -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT`
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

function setStopListener() { 
    console.log('-----------------------------------------> Start StopListener for close Wifi');
    const stopListener = () => {
        if (stopTable) {
            stopTable = false;
            removeRules();
            console.log("---> Send GET /closewifi to camera to shutdown");
            axios.get("http://192.168.4.18:4000/closewifi")      // ne pas mettre l'adresse en clair
            .then((res) => {
                console.log('ici : ' + res.data); 
            })
            .catch(function (error) {
                console.log(error);
            });
            setWifiOff(); 
        }
        return setTimeout(stopListener, 250);
    };
    stopListener();
} 

app.get('/wifi', (req, res) => {
    console.log("----> Receive GET /wifi from cloud to asked state Wi-Fi");
    if (wifi_on){
        console.log("<---- Response GET wifi to cloud : wifi is active");
        res.send(JSON.stringify({"etat":"active"}))
    }
    else{
        console.log("<---- Response GET wifi to cloud : wifi is not active");
        res.send(JSON.stringify({"etat":"inactive"}));
    }   
});

app.get('/disconnect', (req, res) => {
    res.send('ok disconnect');
    stopTable = true;
});
 
app.post('/wifi', (req, res) => {
    let state
    if (req.query.command == "activate"){
        console.log("---> Receive POST /wifi from cloud to activate Wi-Fi");
        const web_real = new Gpio(5, 'out');
        stopTable = false
        state = {'etat':'active'};
        setWifiOn('web');
        web_real.writeSync(1);
        console.log("       LED BOX is ON");
        setTimeout(_ => {web_real.unexport();}, 1000);
    }     
    else { 
        console.log("---> Receive POST /wifi from cloud to desactivate Wi-Fi box");
        state = {'etat':'inactive'};
        console.log("---> Send GET /closewifi to camera to shutdown");
        axios.get("http://192.168.4.18:4000/closewifi")      // ne pas mettre l'url en dur
        .then((res) => {
            console.log("---> Receive GET /closewifi where Wi-Fi Camera is shut down ; " + res.data);
        })
        .catch(function (error) {
            console.log(error);
        }); 
        //setWifiOff();
        stopTable = true;
    }  
    console.log(state)
    res.send(JSON.stringify(state))
}); 

app.get('/leases', (req, res) => {
    console.log('---> Receive GET /leases from Web Client to know the information leases');
    getArpConnectedAsync().then( r => { 
        console.log('---> Response GET /leases to Web Client  : ' + r);
        res.send(r)} 
    );
});  

app.post('/leases', (req, res) => {
    let lease_ip = req.query.ip;
    let command = req.query.command;   
    
    if(command=='route'){
        console.log('---> Receive POST /leases to create route asked by Client Web');
        createNatPreroutingRules(lease_ip).then( () => {
            res.send( `{"status":"routed", "ip":"${lease_ip}"}`);
            console.log(`<---- Response to POST /leases by creating route to ${lease_ip}`);
        });
    }else{
        console.log('---> Receive POST /leases to remove route by Client Web')
        removeRules(); 
        stopTable = false; 
        res.send('{"status":"unrouted"}');
        console.log(`<---- Respoonse to POST /leases by removing route`);
    }
});
  
app.listen(config.port, () => { 
    console.log(`-----------------------------------------> Server cloud listening on port ${config.port}`)
});     
   

setStopListener();    
postMyIp();          