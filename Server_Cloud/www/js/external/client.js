const box_name = "rpi_box";
const NB_SCAN_MAX = 10;
let nbScan = 0;
let scanInterval;
let pingInterval;
let ip_of_box;
let wifi_state;

function retrieveBoxIp() {
    let url = "http://192.168.1.29:8000/boxes_ip/" + box_name; 
    allRequest(url, processBoxIp, 'GET')
}

function retrieveWifiStatus(){
    let url = "http://" + ip_of_box + ":8008/wifi";
    allRequest(url, processWifiStatus, 'GET')
}

function retrieveWifiLeases(){
    let url = "http://" + ip_of_box + ":8008/leases";
    allRequest(url, processWifiLeases, 'GET')
}

function processBoxIp(boxIp){
    ip_of_box = boxIp
    let text = "Box " + box_name + " has IP " + ip_of_box;
    document.getElementById("LiveboxInfo").innerText = text;
    retrieveWifiStatus();
}

function processWifiStatus(wifi_status){
    console.log("wifi status is : "+ wifi_status)
    wifi_state = JSON.parse(wifi_status).etat
    if (wifi_state === "active") 
        scanInterval = setInterval(scanForConnected, 5000);
    else {
        document.getElementById("LeaseInfo").style.visibility = "hidden";
        if(pingInterval)
            clearInterval(pingInterval);
    }
    document.getElementById('wifi_button').innerHTML = wifi_state
}

function processWifiLeases(leases){
    console.log(leases)
    if (leases.length > 0) {
        let ip_cam = leases[0]["ip"]
        let mac_cam = leases[0]["mac"]
        document.getElementById("LeaseInfo").style.visibility = "visible";
        console.log("leases : ip: " + ip_cam + ", mac " + mac_cam)
        document.getElementById("LeaseInfo").innerText = "lease ip " + ip_cam + " has MAC " + mac_cam;
        document.getElementById("LaunchViewing").innerText = "Click to launch Video"
        activateRoutes(ip_cam)
        nbScan = 0;
        clearInterval(scanInterval);
        pingInterval = setInterval(sendPing, 1000);
    }
}

function sendPing(){
    let url = "http://" + ip_of_box + ":8008/ping"
    allRequest(url, responsePing, "POST")
}

function activateRoutes(ip_cam){
    console.log("activate route for ip : " + ip_cam)
    let url = "http://" + ip_of_box + ":8008/leases?ip=" + ip_cam + "&command=route";
    allRequest(url, responseActivate, "POST")
}

function responseActivate(res){
    console.log(res)
}

function responsePing(res){
    console.log(res)
}

function scanForConnected(){
    nbScan += 1;
    console.log ("scan number " + nbScan)
    retrieveWifiLeases()
    if (nbScan >= NB_SCAN_MAX) {
        clearInterval(scanInterval);
        nbScan = 0;
    }
}

function allRequest(url, funct, cmd){
    const request = new XMLHttpRequest()
    request.addEventListener("readystatechange", function() {
        if(this.readyState === 4)  funct(JSON.parse(this.response))
    });
    if (cmd == 'POST'){
        console.log("Post to url : " + url)
        request.open("POST", url);
    }
    else{
        console.log("Get to url : " + url)
        request.open("GET", url);
    }
    request.send()
}

retrieveBoxIp()

function openInNewTab(url) {
    window.open(url, '_blank').focus();
  }

document.getElementById("LaunchViewing").addEventListener('click', function() {
    let url = "http://" + ip_of_box + ":4000";
    //document.getElementById("preview_cam").src = url; 
    openInNewTab(url);
});

document.getElementById('wifi_button').addEventListener('click', function() {
    let url = "http://" + ip_of_box + ":8008/wifi";
    if (wifi_state === "active") 
        url = url + "?command=desactivate"
    else
        url = url + "?command=activate";
    allRequest(url, processWifiStatus, 'POST')
});
