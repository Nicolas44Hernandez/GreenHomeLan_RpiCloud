/* Constants */
const use_situations_url = "http://192.168.1.20:5000/use_situations/current"

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
let new_use_situation = ""

/* Blink function use situations icons */
var interval_use_situations = window.setInterval(function(){
    if(setting_use_situation){
        console.log("blinking")
        if(new_use_situation=="PRESENCE_DAY_LOW_CONSUMPTION"){
            if(use_situation_presence_day_icon.style.visibility == 'hidden'){
                use_situation_presence_day_icon.style.visibility = 'visible';
            }else{
                use_situation_presence_day_icon.style.visibility = 'hidden';
            }
        }
        else if(new_use_situation=="PRESENCE_HOME_OFFICE"){
            if(use_situation_presence_home_office_icon.style.visibility == 'hidden'){
                use_situation_presence_home_office_icon.style.visibility = 'visible';
            }else{
                use_situation_presence_home_office_icon.style.visibility = 'hidden';
            }
        }
        else if(new_use_situation=="PRESENCE_NIGHT_LOW_CONSUMPTION"){
            if(use_situation_presence_night_icon.style.visibility == 'hidden'){
                use_situation_presence_night_icon.style.visibility = 'visible';
            }else{
                use_situation_presence_night_icon.style.visibility = 'hidden';
            }
        }
        else if(new_use_situation=="ABSENCE_LOW_CONSUMPTION"){
            if(use_situation_absence_icon.style.visibility == 'hidden'){
                use_situation_absence_icon.style.visibility = 'visible';
            }else{
                use_situation_absence_icon.style.visibility = 'hidden';
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
    console.log("clear_use_situation_buttons")
    use_situation_presence_day_icon.style.color = "white";
    use_situation_presence_home_office_icon.style.color = "white";
    use_situation_presence_night_icon.style.color = "white";
    use_situation_absence_icon.style.color = "white";
}

function disable_use_situations_buttons(disabled){
    console.log("Use situations buttons disabled: "+ disabled)
    if (disabled){
        use_situation_presence_day_button.onclick = null;
        use_situation_presence_home_office_button.onclick = null;
        use_situation_presence_night_button.onclick = null;
        use_situation_absence_button.onclick = null;
    }
    else{
        set_buttons_on_click()
    }
    
}


function set_use_situation(use_situation){
    // TODO: review
    // disable use situation buttons
    disable_use_situations_buttons(true);

    setting_use_situation = true;
    new_use_situation = use_situation
    clear_use_situation_buttons()
    console.log("Change use situation to: "+use_situation)
    let xhr = new XMLHttpRequest();
    let params = "?use_situation=" + use_situation
    xhr.open("POST", use_situations_url+params);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.send(null);
}

function set_current_use_situation_icon(use_situation){
    current_use_situation = use_situation;
    setting_use_situation = false;

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

/* Buttons on click functions  */
function set_buttons_on_click(){
    
    use_situation_presence_day_button.onclick = function(){
        set_use_situation("PRESENCE_DAY_LOW_CONSUMPTION");
    }
    use_situation_presence_home_office_button.onclick = function(){
        set_use_situation("PRESENCE_HOME_OFFICE");
    }
    use_situation_presence_night_button.onclick = function(){
        set_use_situation("PRESENCE_NIGHT_LOW_CONSUMPTION");
    }
    use_situation_absence_button.onclick = function(){
        set_use_situation("ABSENCE_LOW_CONSUMPTION");
    }  
}
set_buttons_on_click()

socket.on("use_situation", (use_situation) => { 
    console.log("USE SITUATION: "+ use_situation)
    console.log("new_use_situation: "+ new_use_situation)

    if(new_use_situation==""){
        new_use_situation=use_situation
    }
    if(setting_use_situation){
        if(use_situation==new_use_situation){
            // enable use situation buttons
            disable_use_situations_buttons(false);
            set_current_use_situation_icon(use_situation)        
        }        
    }
    else{
        set_current_use_situation_icon(use_situation) 
    }       
});


