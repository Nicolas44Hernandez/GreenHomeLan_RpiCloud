const socket_alimelo = io();
const base_electrical_panel_url = 'http://192.168.1.17:5000/electrical_panel';

/* Alimelo info section  */
alimelo_info = document.getElementById('overlapped_alimelo');
alimelo_info.style.visibility = "hidden";

// Alimelo status values
alimelo_busvoltage = document.getElementById('alimelo-busvoltage');
alimelo_shuntvoltage = document.getElementById('alimelo-shuntvoltage');
alimelo_loadvoltage = document.getElementById('alimelo-loadvoltage');
alimelo_current_mA = document.getElementById('alimelo-current');
alimelo_power_mW = document.getElementById('alimelo-power');
alimelo_batLevel = document.getElementById('alimelo-battery');
alimelo_power_supplied = document.getElementById('alimelo-electricsocket');
alimelo_is_powered_by_battery = document.getElementById('alimelo-poweredbybattery');
alimelo_is_charging = document.getElementById('alimelo-charging');

// electrical panel section
toogle_outlet1 = document.getElementById("toogle-power-outlet-1");
spinner_outlet1 = document.getElementById("spinner-power-outlet-1");
toogle_outlet2 = document.getElementById("toogle-power-outlet-2");
spinner_outlet2 = document.getElementById("spinner-power-outlet-2");
toogle_outlet3 = document.getElementById("toogle-power-outlet-3");
spinner_outlet3 = document.getElementById("spinner-power-outlet-3");


/* Electrical panel initial values*/
toogle_outlet1.checked = false; 
toogle_outlet2.checked = false; 
toogle_outlet1.checked = false; 
spinner_outlet1.style.visibility = "hidden";
spinner_outlet2.style.visibility = "hidden";
spinner_outlet3.style.visibility = "hidden";


/* Set init values */
alimelo_busvoltage.textContent = "n/a";
alimelo_shuntvoltage.textContent = "n/a";
alimelo_loadvoltage.textContent = "n/a";
alimelo_current_mA.textContent = "n/a";
alimelo_power_mW.textContent = "n/a";
alimelo_batLevel.textContent = "n/a";
alimelo_power_supplied.textContent = "n/a";
alimelo_is_powered_by_battery.textContent = "n/a";
alimelo_is_charging.textContent = "n/a";

/* Electrical pannel toogles on event functions  */
function set_electrical_panel_toogles_on_event(){    
    toogle_outlet1.addEventListener("change", function() {
        console.log("Change outlet1 status: " + this.checked);
        set_outlet_status(1, this.checked);        
    });
    toogle_outlet2.addEventListener("change", function() {
        console.log("Change outlet2 status: " + this.checked);
        set_outlet_status(2, this.checked);        
    });
    toogle_outlet3.addEventListener("change", function() {
        console.log("Change outlet3 status: " + this.checked);
        set_outlet_status(3, this.checked);        
    });
}
set_electrical_panel_toogles_on_event();

function set_outlet_status(outlet_number, new_status){
    console.log("outlet_number: " + outlet_number + " new status: " + new_status);
    switch(outlet_number){   
        case 1: 
            spinner_outlet1.style.visibility = "visible";
            break;    
        case 2:
            spinner_outlet2.style.visibility = "visible";
            break;    
        case 3:
            spinner_outlet3.style.visibility = "visible";
            break;
        default:            
            break;
    }    
    
    // query params
    const params = {
        relay_0: toogle_outlet1.checked,
        relay_1: toogle_outlet2.checked,
        relay_2: toogle_outlet3.checked,
        relay_3: false,
        relay_4: false,
        relay_5: false,        
    };    
    // convert the object to a query string
    const queryString = Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
    // construct the final URL with the query string
    const url = `${base_electrical_panel_url}?${queryString}`;
    console.log("url: "+ url);
        
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Accept", "*/*");
    xhr.send(null);

    xhr.onload = function() {        
        const response_json = JSON.parse(xhr.responseText);
        if (xhr.status === 200) {
            switch(outlet_number){   
                case 1: 
                    toogle_outlet1.checked = new_status;
                    break;    
                case 2:
                    toogle_outlet2.checked = new_status;
                    break;    
                case 3:
                    toogle_outlet3.checked = new_status;
                    break;
                default:            
                    break;
            }   
        } 
        spinner_outlet1.style.visibility = "hidden";
        spinner_outlet2.style.visibility = "hidden";
        spinner_outlet3.style.visibility = "hidden";
    };
    xhr.onerror = function() {
        console.error("Network error");
        switch(outlet_number){   
                case 1: 
                    toogle_outlet1.checked = !new_status;
                    break;    
                case 2:
                    toogle_outlet2.checked = !new_status;
                    break;    
                case 3:
                    toogle_outlet3.checked = !new_status;
                    break;
                default:            
                    break;
        }  
        spinner_outlet1.style.visibility = "hidden";
        spinner_outlet2.style.visibility = "hidden";
        spinner_outlet3.style.visibility = "hidden";
    };
}
socket_alimelo.on("alimelo_status_detail", (
    busvoltage,
    shuntvoltage,
    loadvoltage,
    current_mA,
    power_mW,
    batLevel,
    power_supplied,
    powered_by_battery,
    charging,
    ) => { 
        console.log("En el metodo");
        if(busvoltage != null){
            console.log("busvoltage:" + busvoltage);
            alimelo_busvoltage.textContent = busvoltage.toFixed(2) + " mV";
        }
        if(shuntvoltage != null){
            console.log("shuntvoltage:" + shuntvoltage);
            alimelo_shuntvoltage.textContent = shuntvoltage.toFixed(2) + " mV";
        }
        if(loadvoltage != null){
            console.log("loadvoltage:" + loadvoltage);
            alimelo_loadvoltage.textContent = loadvoltage.toFixed(2) + " mV";
        }
        if(current_mA != null){
            console.log("current_mA:" + current_mA);
            alimelo_current_mA.textContent = current_mA.toFixed(2) + " mA";
        }
        if(power_mW != null){
            console.log("power_mW:" + power_mW);
            alimelo_power_mW.textContent = power_mW.toFixed(2) + " mW";
        }
        console.log("batlevel: "+ alimelo_batLevel);
        if(batLevel != null){
            console.log("batLevel:" + batLevel);
            alimelo_batLevel.textContent = batLevel + '%';
        } 
        if(power_supplied != null){
            console.log("power_supplied:" + power_supplied);
            alimelo_power_supplied.textContent = power_supplied;
        }   
        if(powered_by_battery != null){
            console.log("powered_by_battery:" + powered_by_battery);
            alimelo_is_powered_by_battery.textContent = powered_by_battery;
        } 
        if(charging != null){
            console.log("charging:" + charging);
            alimelo_is_charging.textContent = charging;   
        }                         
});

socket_alimelo.on("power_outlets_status", (
    po0_status,
    po1_status,
    po2_status,
    ) => { 
        toogle_outlet1.checked = po0_status; 
        toogle_outlet2.checked = po1_status; 
        toogle_outlet3.checked = po2_status;                     
});
