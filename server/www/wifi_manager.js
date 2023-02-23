/* RPI box URL */
// TODO: expose to internet 
const base_wifi_url = 'http://192.168.1.20:5000/wifi';

/* Wifi Info section  */
toogle_wifi_all = document.getElementById("toogle-wifi-all")
toogle_wifi_6GHz = document.getElementById("toogle-wifi-6GHz")
toogle_wifi_5GHz = document.getElementById("toogle-wifi-5GHz")
toogle_wifi_2GHz = document.getElementById("toogle-wifi-2GHz")
spinner_wifi = document.getElementById("spinner-wifi")

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
    fetch(url)
    .then(response => {
        spinner_wifi.style.visibility = "hidden";
        console.log("TODO: manage response")
        return response.json();
      })
    .catch(error => {
        spinner_wifi.style.visibility = "hidden";
        toogle_wifi_all.checked = !new_status;
        console.error(error);        
    });
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

    // send the request and wait for the response
    fetch(url)
    .then(response => {
        console.log("TODO: manage response")
        return response.json();
      })
    .catch(error => {
        spinner_wifi.style.visibility = "hidden";
        if(band == "6GHz"){
            toogle_wifi_6GHz.checked = !new_status;
        }
        else if(band == "5GHz"){
            toogle_wifi_5GHz.checked = !new_status;
        }
        else if(band == "2GHz"){
            toogle_wifi_2GHz.checked = !new_status;
        }        
        console.error(error);        
    });
}