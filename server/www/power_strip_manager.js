const socket_power_strip = io();
base_power_strip_url = '';

/* Power strip info section  */
power_strip_info = document.getElementById('overlapped_power_strip');
power_strip_info.style.visibility = "hidden";

// Power strip outlets panel section
toogle_power_strip_outlet1 = document.getElementById("toogle-power-strip-outlet-1");
spinner_power_strip_outlet1 = document.getElementById("spinner-power-strip-outlet-1");
toogle_power_strip_outlet2 = document.getElementById("toogle-power-strip-outlet-2");
spinner_power_strip_outlet2 = document.getElementById("spinner-power-strip-outlet-2");
toogle_power_strip_outlet3 = document.getElementById("toogle-power-strip-outlet-3");
spinner_power_strip_outlet3 = document.getElementById("spinner-power-strip-outlet-3");
toogle_power_strip_outlet4 = document.getElementById("toogle-power-strip-outlet-4");
spinner_power_strip_outlet4 = document.getElementById("spinner-power-strip-outlet-4");

/* Power strip panel initial values*/
toogle_power_strip_outlet1.checked = false; 
toogle_power_strip_outlet2.checked = false; 
toogle_power_strip_outlet3.checked = false; 
toogle_power_strip_outlet4.checked = false; 
spinner_power_strip_outlet1.style.visibility = "hidden";
spinner_power_strip_outlet2.style.visibility = "hidden";
spinner_power_strip_outlet3.style.visibility = "hidden";
spinner_power_strip_outlet4.style.visibility = "hidden";

/* Power strip toogles on event functions  */
function set_power_strip_toogles_on_event(){    
    toogle_power_strip_outlet1.addEventListener("change", function() {
        console.log("Change power strip outlet1 status: " + this.checked);
        set_power_strip_outlet_status(1, this.checked);        
    });
    toogle_power_strip_outlet2.addEventListener("change", function() {
        console.log("Change power strip outlet2 status: " + this.checked);
        set_power_strip_outlet_status(2, this.checked);        
    });
    toogle_power_strip_outlet3.addEventListener("change", function() {
        console.log("Change power strip outlet3 status: " + this.checked);
        set_power_strip_outlet_status(3, this.checked);        
    });
    toogle_power_strip_outlet4.addEventListener("change", function() {
        console.log("Change power strip outlet4 status: " + this.checked);
        set_power_strip_outlet_status(4, this.checked);        
    });
}
set_power_strip_toogles_on_event();

function set_power_strip_outlet_status(outlet_number, new_status){
    console.log("outlet_number: " + outlet_number + " new status: " + new_status);
    switch(outlet_number){   
        case 1: 
            spinner_power_strip_outlet1.style.visibility = "visible";
            break;    
        case 2:
            spinner_power_strip_outlet2.style.visibility = "visible";
            break;    
        case 3:
            spinner_power_strip_outlet3.style.visibility = "visible";
            break;
        case 4:
            spinner_power_strip_outlet4.style.visibility = "visible";
            break;
        default:            
            break;
    }    
    
    // query params
    const params = {
        relay_1: toogle_power_strip_outlet1.checked,
        relay_2: toogle_power_strip_outlet2.checked,
        relay_3: toogle_power_strip_outlet3.checked,
        relay_4: toogle_power_strip_outlet4.checked,
    };    
    // convert the object to a query string
    const queryString = Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
    // construct the final URL with the query string
    const url = `${base_power_strip_url}?${queryString}`;
    console.log("url: "+ url);
    
    if(url.length > (queryString.length + 3)){
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.setRequestHeader("Accept", "*/*");
        xhr.send(null);

        xhr.onload = function() {        
            const response_json = JSON.parse(xhr.responseText);
            if (xhr.status === 200) {
                switch(outlet_number){   
                    case 1: 
                        toogle_power_strip_outlet1.checked = new_status;
                        break;    
                    case 2:
                        toogle_power_strip_outlet2.checked = new_status;
                        break;    
                    case 3:
                        toogle_power_strip_outlet3.checked = new_status;
                        break;
                    case 4:
                        toogle_power_strip_outlet4.checked = new_status;
                        break;
                    default:            
                        break;
                }   
            } 
            else{
                switch(outlet_number){   
                    case 1: 
                        toogle_power_strip_outlet1.checked = !new_status;
                        break;    
                    case 2:
                        toogle_power_strip_outlet2.checked = !new_status;
                        break;    
                        case 3:
                            toogle_power_strip_outlet3.checked = !new_status;
                            break;
                        case 3:
                            toogle_power_strip_outlet4.checked = !new_status;
                            break;
                    default:            
                        break;
                }
            }
            spinner_power_strip_outlet1.style.visibility = "hidden";
            spinner_power_strip_outlet2.style.visibility = "hidden";
            spinner_power_strip_outlet3.style.visibility = "hidden";
            spinner_power_strip_outlet4.style.visibility = "hidden";
        };
        xhr.onerror = function() {
            console.error("Network error");
            switch(outlet_number){   
                    case 1: 
                        toogle_power_strip_outlet1.checked = !new_status;
                        break;    
                    case 2:
                        toogle_power_strip_outlet2.checked = !new_status;
                        break;    
                    case 3:
                        toogle_power_strip_outlet3.checked = !new_status;
                        break;
                    case 4:
                        toogle_power_strip_outlet4.checked = !new_status;
                        break;
                    default:            
                        break;
            }  
            spinner_power_strip_outlet1.style.visibility = "hidden";
            spinner_power_strip_outlet2.style.visibility = "hidden";
            spinner_power_strip_outlet3.style.visibility = "hidden";
            spinner_power_strip_outlet4.style.visibility = "hidden";
        };
    }
    else{
        console.log("Base url not yet received"); 
        switch(outlet_number){   
            case 1: 
                toogle_power_strip_outlet1.checked = !new_status;
                break;    
            case 2:
                toogle_power_strip_outlet2.checked = !new_status;
                break;    
            case 3:
                toogle_power_strip_outlet3.checked = !new_status;
                break;
            case 4:
                toogle_power_strip_outlet4.checked = !new_status;
                break;
            default:            
                break;
        }  
        spinner_power_strip_outlet1.style.visibility = "hidden";
        spinner_power_strip_outlet2.style.visibility = "hidden";
        spinner_power_strip_outlet3.style.visibility = "hidden";
        spinner_power_strip_outlet4.style.visibility = "hidden";
    }   
}


socket_power_strip.on("power_strip_status", (relay1_status, relay2_status, relay3_status, relay4_status) => { 
    toogle_power_strip_outlet1.checked = relay1_status; 
    toogle_power_strip_outlet2.checked = relay2_status; 
    toogle_power_strip_outlet3.checked = relay3_status; 
    toogle_power_strip_outlet4.checked = relay4_status;     
});

socket_power_strip.on("orquestrator_base_url", (url) => { 
    console.log('URL RECEIVED IN ALIMELO MANAGER '+ url);
    base_power_strip_url=url+"power_strip";
});
