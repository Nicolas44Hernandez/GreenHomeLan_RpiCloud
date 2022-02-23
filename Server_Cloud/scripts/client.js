


var socket;
var box_name = "rpi_box";
var ip_of_box;
var wifi_state;

var scanInterval;
var nbScan = 0;



function retrieveBoxIp (onFinishHandler, boxName) {
  var url = "http://172.16.57.126:8000/boxes_ip/"+boxName; //+encodeURIComponent(stream_id) + formatted_params;

  let request = new XMLHttpRequest()

  request.addEventListener("readystatechange", function() {
      if(this.readyState === 4) {
        onFinishHandler(JSON.parse(this.response))
      }
  });
  console.log(url)
  request.open("GET", url);
  request.send() 
}

function retrieveWifiStatus (onFinishHandler, boxIp) {
  var url = "http://"+boxIp+":8008/wifi"; //+encodeURIComponent(stream_id) + formatted_params;

  let request = new XMLHttpRequest()

  request.addEventListener("readystatechange", function() {
      if(this.readyState === 4) {
        onFinishHandler(JSON.parse(this.response))
      }
  });
  console.log(url)
  request.open("GET", url);
  request.send() 
}

function scanForConnected (){

  nbScan += 1;

  console.log ("scan number " + nbScan)
  retrieveWifiLeases (onFinishHandler=processWifiLeases, boxIp=ip_of_box)
  if (nbScan > 10) {
    clearInterval(scanInterval);
  }


}
function processWifiStatus (wifi_status){
  console.log("wifi status is : "+ wifi_status)
  let theButton = document.getElementById('wifi_button')
  theButton.setAttribute('textContent', wifi_status);
  theButton.setAttribute('innerText', wifi_status);
  wifi_state = JSON.parse(wifi_status).etat
  if (wifi_state === "active"){
    theButton.textContent = "disable"
    theButton.innerText = "disable"
    scanInterval = setInterval(scanForConnected, 10000);
  } else {
    theButton.textContent = "enable"
    theButton.innerText = "enable"
  }
  // wifi_status
}

function processBoxIp(data){
            
  console.log(data)
  ip_of_box = data
  var el_up = document.getElementById("LiveboxInfo");
  el_up.innerText = "Box " + box_name + " has IP " + ip_of_box;
  // list = []
  // var listOfMigrations = [];
  // Object.keys(data).forEach((item) => {
  //     console.log(item)
  //     list.push (data[item])
  // });
  // console.log(list)
  // constructTable('#table')

  // socket = io("http://"+ip_of_box+":8080");

  retrieveWifiStatus (onFinishHandler=processWifiStatus, boxIp=ip_of_box)
}	                

function processWifiLeases (leases){
  console.log(leases.length + "leases : ")
  if (leases.length > 0) {
    console.log("leases 0 ip: " + leases[0]["ip"] + ", mac " + leases[0]["mac"])
    var el_up = document.getElementById("LeaseInfo");
    el_up.innerText = "lease ip " + leases[0]["ip"] + " has MAC " + leases[0]["mac"];
    var el_up = document.getElementById("LaunchViewing");
    el_up.innerHTML = "<div onclick=\"openInNewTab('http://'+ ip_of_box+':4000');\">ViewCam</div>"

  }
}

function retrieveWifiLeases (onFinishHandler, boxIp){

  var url = "http://"+boxIp+":8008/leases"; //+encodeURIComponent(stream_id) + formatted_params;

  var xhr = new XMLHttpRequest();
  // xhr.withCredentials = true;
  
  xhr.addEventListener("readystatechange", function() {
    if(this.readyState === 4) {
      onFinishHandler(JSON.parse(this.response));
    }
  });
  
  xhr.open("GET", url);
  
  xhr.send();
}

function switchWifiStatus () {
  var url = "http://"+ip_of_box+":8008/wifi"; //+encodeURIComponent(stream_id) + formatted_params;
  var xhr = new XMLHttpRequest();

  if (wifi_state === "active"){
    url = url + "?command=desactivate"
  } else {
    url = url + "?command=activate"
  }

  // xhr.withCredentials = true;
  
  xhr.addEventListener("readystatechange", function() {
    if(this.readyState === 4) {
      console.log(this.responseText);
      retrieveWifiStatus (onFinishHandler=processWifiStatus, boxIp=ip_of_box)
    }
  });
  console.log(url)
  xhr.open("POST", url);
  
  xhr.send();


  // let request = new XMLHttpRequest()


  // request.open("POST", url, true);

  // request.addEventListener("readystatechange", function() {
  //     if(this.readyState === 4) {
  //       onFinishHandler(JSON.parse(this.response))
  //     }
  // });

	// request.setRequestHeader("Accept",'application/json')
	// request.setRequestHeader("Content-type",'application/json')

	// request.onLoad= (event) => {
  // 	if (this.status === 202) {
  // 		console.log("Command result = " + this.responseText)
  // 	} else {
  // 		console.log("erreur")
  // 	}
  // }



  // // console.log(data)
  // request.send() 
}

// const socket_client = io_client("http://172.16.57.129:8080");

// socket_client.on("connect", () => {
//   console.log('Mon Id à ma connection : ' + socket_client.id);
// });

function myFunction() {
    console.log("bonjour")
    switchWifiStatus ()
    // socket.emit('chat_message', "coucou");
  //document.getElementById("demo").style.color = "red";
}

function openInNewTab(url) {
  window.open(url, '_blank').focus();
}


retrieveBoxIp (onFinishHandler=processBoxIp, boxName=box_name)
