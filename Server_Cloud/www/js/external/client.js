const box_name = "rpi_box";
const socket = io();
const NB_SCAN_MAX = 10;
let nbScan = 0;
let scanInterval;
//let pingInterval;
let ip_of_box;
let wifi_state;
let watt = 0;
let justclick = false;
let justButton = false;
let activate_lease = true;
let new_data = [0, 0 ,0 , 0, 0, 0, 0, 0, 0,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,];
const NEW_VERSION = true;
const ctx  = document.getElementById('myChart').getContext("2d");
const labels = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '24',
];
const data = {
    labels: labels,
    datasets: [{
        label: 'Evolution de la consommation dans le HomeLan',
        backgroundColor: 'rgb(0, 99, 132)',
        borderColor: 'rgb(0, 99, 132)',
        data: new_data,
    }]
}; 
const config = {
    type: 'line',
    data: data,
    options: {}
};
const myChart = new Chart(ctx ,config);

socket.on("connect", () => { 
    console.log('Connected to Server_cloud with id : ' + socket.id); 
    justButton = true;
});

socket.on("data", (arg) => { 
    console.log("In Socket Data")
    console.log('Connected to Server_cloud with id : ' + socket.id); 
    console.log("       ---> Receive socket from cloud to launch retreive process");
    
    retrieveBoxIp();
    /*
    let url = "http://" + ip_of_box + ":8008/wifi";
    if (wifi_state === "inactive"){
        console.log("The Status Wi-Fi is inactive then");
        console.log("---> Send POST to "+ url +" Box to activate Wi-Fi");
        url = url + "?command=activate"
        allRequest(url, processWifiStatus, 'POST');
    }*/
});

socket.on("buttonBle", (arg) => { 
    console.log("---> Receive socket from cloud by buttonBLE ");
    justButton = true;
    retrieveBoxIp();
    //retrieveBoxIp();
    /*
    let url = "http://" + ip_of_box + ":8008/wifi";
    if (wifi_state === "inactive"){
        console.log("The Status Wi-Fi is inactive then");
        console.log("---> Send POST to "+ url +" Box to activate Wi-Fi");
        url = url + "?command=activate"
        allRequest(url, processWifiStatus, 'POST');
    }*/
}); 

function retrieveBoxIp() {
    let url = document.URL+ "boxes_ip/" + box_name;
    console.log("---> Send GET to " + url+ " to cloud to know the ip adress Box: ");
    allRequest(url, processBoxIp, 'GET')
}

function retrieveWifiStatus(){
    let url = "http://" + ip_of_box + ":8008/wifi";
    console.log("---> Send GET to " + url+ " to box to know its ip status: ");
    allRequest(url, processWifiStatus, 'GET')
} 

function retrieveWifiLeases(){
    let url = "http://" + ip_of_box + ":8008/leases";
    console.log("---> Send GET to " + url + " to box to know leases status: ");
    allRequest(url, processWifiLeases, 'GET')
}

function processBoxIp(boxIp){
    ip_of_box = boxIp
    let text = "Box " + box_name + " has IP " + ip_of_box;
    document.getElementById("LiveboxInfo").innerText = text;
    retrieveWifiStatus();
}

function processWifiStatus(wifi_status){
    wifi_state = wifi_status.etat;
    console.log("wifi_state is : " + wifi_state + ' justclick is : ' + justclick + ' and justButton is : ' + justButton);
    console.log("========>  resultat du test boolean : " + (wifi_state === "active" && (justclick || justButton)));
    if (wifi_state === "active" && (justclick || justButton)) {
        watt = 1;
        justclick = false;
        justButton = false;
        console.log("scanForConnected lancé ****************************************");
        scanInterval = setInterval(scanForConnected, 5000);
    }
    else if (wifi_state === "inactive") {
        watt = 0;
        document.getElementById("LeaseInfo").style.visibility = "hidden";
        document.getElementById("LaunchViewing").style.visibility = "hidden";
 /*       if(pingInterval)
            clearInterval(pingInterval);*/
    }
    console.log("Update status button to : " + wifi_state);
    document.getElementById('wifi_button').innerHTML = wifi_state
}

function processWifiLeases(leases){
    let len = Object.keys(leases).length
    if (len > 0 ) {
        console.log('**************************** Route à activer');
        watt = 2;
        let ip_cam = leases["ip"];
        let mac_cam = leases["mac"];
        document.getElementById("LeaseInfo").style.visibility = "visible";
        document.getElementById("LaunchViewing").style.visibility = "visible";
        console.log("leases : ip: " + ip_cam + ", mac " + mac_cam)
        document.getElementById("LeaseInfo").innerText = "lease ip " + ip_cam + " has MAC " + mac_cam;
        document.getElementById("LaunchViewing").innerText = "Click to launch Video"
        activateRoutes(ip_cam);
        nbScan = NB_SCAN_MAX;
        /* 
        nbScan = 0;
        clearInterval(scanInterval);*/
        //pingInterval = setInterval(sendPing, 1000);
    } 
}
/*
function sendPing(){
    let url = "http://" + ip_of_box + ":8008/ping"
    allRequest(url, responsePing, "POST")
}*/

function activateRoutes(ip_cam){
    console.log("---> Send POST /lease&route to activate route for ip : " + ip_cam)
    let url = "http://" + ip_of_box + ":8008/leases?ip=" + ip_cam + "&command=route";
    allRequest(url, responseActivate, "POST")
}

function responseActivate(res){
    //console.log(res)
}

function responsePing(res){
    console.log(res)
} 

function scanForConnected(){
    nbScan += 1;
    console.log ("      Scan attempt to create route with camera : number " + nbScan + "/" + NB_SCAN_MAX);
    retrieveWifiLeases()
    if (nbScan >= NB_SCAN_MAX) {
        clearInterval(scanInterval);
        nbScan = 0;
    }
}

function allRequest(url, funct, cmd){
    const request = new XMLHttpRequest()
    request.addEventListener("readystatechange", function() {
        if(this.readyState === 4) {
            if (this.response)
                console.log("<--- Receive Response by : " + (this.response));
            funct(JSON.parse(this.response))
        }
    });
    if(cmd == 'POST')
        request.open("POST", url);
    else
        request.open("GET", url);
    request.send()
}
 
function afficheWatt(){
}

function openInNewTab(url) {
    window.open(url, '_blank').focus();
}

function updateChart(){
    myChart.data.datasets[0].data.shift();
    myChart.data.datasets[0].data.push(watt);
    myChart.update();
};

document.getElementById("LaunchViewing").addEventListener('click', function() {
    let url = "http://" + ip_of_box + ":4000";
    document.getElementById("test").src = url; 
    document.getElementById("test").style.visibility = "visible";
    watt = 3;
    //document.getElementById("preview_cam").src = url; 
    //openInNewTab(url);
});

document.getElementById('wifi_button').addEventListener('click', function() {
    let url = "http://" + ip_of_box + ":8008/wifi";
    if (wifi_state === "active"){
        console.log("Click on button desactivate Wi-Fi");
        url = url + "?command=desactivate";
        console.log("---> Send POST to " + url+ " to box desactivate its Wi-Fi");
        //document.getElementById("test").style.visibility = "hidden";
        document.getElementById("test").src = "imgs/default.jpg"; 
    }else{
        justclick = true;
        console.log("Click on button activate Wi-Fi");
        console.log("---> Send POST to " + url+ " to box activate its Wi-Fi");
        url = url + "?command=activate";
    }
        
    allRequest(url, processWifiStatus, 'POST');
});

retrieveBoxIp();
setInterval(afficheWatt,250);
setInterval(updateChart, 250);