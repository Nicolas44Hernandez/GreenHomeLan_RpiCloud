/* Constants */
const socket_use_situation = io();
//const base_use_situations_url = "http://localhost:5000/use_situations"
const base_use_situations_url = "http://192.168.1.20:5000/use_situations"

/* Use situations buttons */
use_situation_presence_day_button = document.getElementById('us-button-presence-day'); 
use_situation_presence_day_icon = document.getElementById('icon-presence-day');  
use_situation_presence_home_office_button = document.getElementById('us-button-presence-home-office'); 
use_situation_presence_home_office_icon = document.getElementById('icon-presence-homeoffice');  
use_situation_presence_night_button = document.getElementById('us-button-presence-night'); 
use_situation_presence_night_icon = document.getElementById('icon-presence-night');  
use_situation_absence_button = document.getElementById('us-button-absence');
use_situation_absence_icon = document.getElementById('icon-absence');

// Use situations 
let setting_use_situation = false;
let current_use_situation = "";
let new_use_situation = "";

/* Buttons on click functions  */
function set_buttons_on_click(){
    
    use_situation_presence_day_button.onclick = function(){
        if(!setting_use_situation){
            console.log("PRESENCE_DAY_LOW_CONSUMPTION");
            set_use_situation("PRESENCE_DAY_LOW_CONSUMPTION");
        }        
    }
    use_situation_presence_home_office_button.onclick = function(){
        if(!setting_use_situation){
            console.log("PRESENCE_HOME_OFFICE");
            set_use_situation("PRESENCE_HOME_OFFICE");
        }    
    }
    use_situation_presence_night_button.onclick = function(){
        if(!setting_use_situation){
            console.log("PRESENCE_NIGHT_LOW_CONSUMPTION");
            set_use_situation("PRESENCE_NIGHT_LOW_CONSUMPTION");
        }
    }
    use_situation_absence_button.onclick = function(){
        if(!setting_use_situation){
            console.log("ABSENCE_LOW_CONSUMPTION");
            set_use_situation("ABSENCE_LOW_CONSUMPTION");
        }
    }  
}
set_buttons_on_click()

/* Blink function use situations icons */
var interval_use_situations = window.setInterval(function(){
    if(setting_use_situation){
        let blinking = true;
        switch(new_use_situation){
            case "PRESENCE_DAY_LOW_CONSUMPTION":
                blinking_icon = document.getElementById('icon-presence-day');    
                break;                     
            case "PRESENCE_HOME_OFFICE":
                blinking_icon = document.getElementById('icon-presence-homeoffice'); 
                break; 
            case "PRESENCE_NIGHT_LOW_CONSUMPTION":
                blinking_icon = document.getElementById('icon-presence-night');
                break; 
            case "ABSENCE_LOW_CONSUMPTION":
                blinking_icon = document.getElementById('icon-absence');
                break; 
            default:
                blinking = false;
                console.error("Invalid use situation: "+ new_use_situation);
            
        }
        if(blinking){
            if(blinking_icon.style.visibility == 'hidden'){
                blinking_icon.style.visibility = 'visible';
            }else{
                blinking_icon.style.visibility = 'hidden';
            }
        }        
    }
    else {
        use_situation_presence_day_icon.style.visibility = 'visible';
        use_situation_presence_home_office_icon.style.visibility = 'visible';
        use_situation_presence_night_icon.style.visibility = 'visible';
        use_situation_absence_icon.style.visibility = 'visible';
    }
}, 500);

function clear_use_situation_buttons(){
    use_situation_presence_day_icon.style.color = "white";
    use_situation_presence_home_office_icon.style.color = "white";
    use_situation_presence_night_icon.style.color = "white";
    use_situation_absence_icon.style.color = "white";
}

function set_use_situation(use_situation){    
    new_use_situation = use_situation;
    setting_use_situation = true;
    clear_use_situation_buttons()
    console.log("Change use situation to: "+use_situation)

    // query params
    const params = {use_situation: use_situation};    
    // convert the object to a query string
    const queryString = Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
    // construct the final URL with the query string
    const url = `${base_use_situations_url}/current?${queryString}`;
    console.log("url: "+ url);

    // send the request and wait for the response
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Accept", "*/*");
    xhr.send(null);

    xhr.onload = function() {        
        const response_json = JSON.parse(xhr.responseText);
        if (xhr.status === 200) {
            console.log("OK");
            console.log(xhr.responseText);
            set_current_use_situation_icon(use_situation)
        } else {
            console.error("Error:", xhr.statusText);
            clear_use_situation_buttons();
        }
        setting_use_situation = false;        
    };
    xhr.onerror = function() {
        console.error("Network error"); 
        clear_use_situation_buttons();
        setting_use_situation = false;       
    };
}

function set_current_use_situation_icon(use_situation){
    current_use_situation = use_situation;
    setting_use_situation = false;
    new_use_situation = "";

    if(use_situation=="PRESENCE_DAY_LOW_CONSUMPTION"){
        use_situation_presence_day_icon.style.color = "orangered";
        use_situation_presence_home_office_icon.style.color = "white";
        use_situation_presence_night_icon.style.color = "white";
        use_situation_absence_icon.style.color = "white";
    }
    else if(use_situation=="PRESENCE_HOME_OFFICE"){
        use_situation_presence_day_icon.style.color = "white";
        use_situation_presence_home_office_icon.style.color = "orangered";
        use_situation_presence_night_icon.style.color = "white";
        use_situation_absence_icon.style.color = "white";
    }
    else if(use_situation=="PRESENCE_NIGHT_LOW_CONSUMPTION"){
        use_situation_presence_day_icon.style.color = "white";
        use_situation_presence_home_office_icon.style.color = "white";
        use_situation_presence_night_icon.style.color = "orangered";
        use_situation_absence_icon.style.color = "white";
    }
    else if(use_situation=="ABSENCE_LOW_CONSUMPTION"){
        use_situation_presence_day_icon.style.color = "white";
        use_situation_presence_home_office_icon.style.color = "white";
        use_situation_presence_night_icon.style.color = "white";
        use_situation_absence_icon.style.color = "orangered";
    }  
}

socket_use_situation.on("use_situation", (use_situation) => { 
    console.log("RECEIVED USE SITUATION: "+ use_situation)
    if(!setting_use_situation){
        set_current_use_situation_icon(use_situation);    
    }   
});


