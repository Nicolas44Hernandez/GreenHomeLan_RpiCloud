/* RPI box URL */
const base_wifi_url = 'http://192.168.1.17:5000/wifi';

const socket_wifi = io();

/* Wifi Info section  */
toogle_wifi_all = document.getElementById("toogle-wifi-all")
toogle_wifi_6GHz = document.getElementById("toogle-wifi-6GHz")
toogle_wifi_5GHz = document.getElementById("toogle-wifi-5GHz")
toogle_wifi_2GHz = document.getElementById("toogle-wifi-2GHz")
spinner_wifi = document.getElementById("spinner-wifi")

/* Wifi info section */
wifi_info = document.getElementById('overlapped_wifi');
wifi_info.style.visibility = "hidden";
toogle_wifi_all.checked = false; 
toogle_wifi_6GHz.checked = false; 
toogle_wifi_5GHz.checked = false; 
toogle_wifi_2GHz.checked = false; 
spinner_wifi.style.visibility = "hidden";

/* Wifi toogles on event functions  */
function set_wifi_toogles_on_event(){    
    toogle_wifi_all.addEventListener("change", function() {
        console.log("Set wifi status: " + this.checked);
        set_wifi_status(this.checked);        
    });
    toogle_wifi_6GHz.addEventListener("change", function() {
        console.log("Set 6GHz band status: " + this.checked);    
        set_wifi_band_status("6GHz", this.checked);        
    });
    toogle_wifi_5GHz.addEventListener("change", function() {
        console.log("Set 5GHz band status: " + this.checked);
        set_wifi_band_status("5GHz", this.checked);        
    });
    toogle_wifi_2GHz.addEventListener("change", function() {
        console.log("Set 2.4GHz band status: " + this.checked);
        set_wifi_band_status("2.4GHz", this.checked);        
    });
}
set_wifi_toogles_on_event();

function set_wifi_status(new_status){
    console.log("New wifi status:" + new_status);
    spinner_wifi.style.visibility = "visible";
    
    // query params
    const params = {status: new_status};    
    // convert the object to a query string
    const queryString = Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
    // construct the final URL with the query string
    const url = `${base_wifi_url}?${queryString}`;
    console.log("url: "+ url);

    // send the request and wait for the response
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Accept", "*/*");
    xhr.send(null);

    xhr.onload = function() {        
        const response_json = JSON.parse(xhr.responseText);
        const received_new_status = response_json.status;
        if (xhr.status === 200 && received_new_status == new_status) {
            toogle_wifi_all.checked = new_status;                  
        } else {
            toogle_wifi_all.checked = !new_status; 
            console.error("Error:", xhr.statusText);
        }
        spinner_wifi.style.visibility = "hidden";
    };
    xhr.onerror = function() {
        console.error("Network error");
        toogle_wifi_all.checked = !new_status; 
        spinner_wifi.style.visibility = "hidden";
    };
}

function set_wifi_band_status(band, new_status){
    console.log("band: " + band + " new status: " + new_status);
    spinner_wifi.style.visibility = "visible";
    
    // query params
    const params = {status: new_status};    
    // convert the object to a query string
    const queryString = Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
    // construct the final URL with the query string
    const url = `${base_wifi_url}/bands/${band}?${queryString}`;
    console.log("url: "+ url);
    
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Accept", "*/*");
    xhr.send(null);

    xhr.onload = function() {        
        const response_json = JSON.parse(xhr.responseText);
        const received_new_status = response_json.status;
        if (xhr.status === 200 && received_new_status == new_status) {
            if(band=="6GHz"){
                toogle_wifi_6GHz.checked = new_status; 
            }
            else if(band=="5GHz"){
                toogle_wifi_5GHz.checked = new_status; 
            }
            else if(band=="2.4GHz"){
                toogle_wifi_2GHz.checked = new_status; 
            }            
        } else {
            if(band=="6GHz"){
                toogle_wifi_6GHz.checked = !new_status; 
            }
            else if(band=="5GHz"){
                toogle_wifi_5GHz.checked = !new_status; 
            }
            else if(band=="2.4GHz"){
                toogle_wifi_2GHz.checked = !new_status; 
            }    
            console.error("Error:", xhr.statusText);
        }
        spinner_wifi.style.visibility = "hidden";
    };
    xhr.onerror = function() {
        console.error("Network error");
        if(band=="6GHz"){
            toogle_wifi_6GHz.checked = !new_status; 
        }
        else if(band=="5GHz"){
            toogle_wifi_5GHz.checked = !new_status; 
        }
        else if(band=="2.4GHz"){
            toogle_wifi_2GHz.checked = !new_status; 
        }    
        spinner_wifi.style.visibility = "hidden";
    };
}

socket_wifi.on("wifi_status_detail", (wifi_status, band_2GHz_status, band_5GHz_status, band_6GHz_status) => { 
    toogle_wifi_all.checked = wifi_status; 
    toogle_wifi_2GHz.checked = band_2GHz_status; 
    toogle_wifi_5GHz.checked = band_5GHz_status; 
    toogle_wifi_6GHz.checked = band_6GHz_status; 
});