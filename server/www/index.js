
/* Constants */
const socket = io();
const url_camera = "http://192.168.1.13:5000/video_stream"
const use_situations_url = "http://192.168.1.20:5000/use_situations/current"
const loading_frame = "imgs/default.jpg"

/* Elements */
// Video stream frame and button
video_stream = document.getElementById("frame")
get_live_stream_button = document.getElementById("get_live_stream_button")


// Notification icons
wifi_icon = document.getElementById("icon-wifi")
video_on_icon = document.getElementById("icon-video-on")
video_off_icon = document.getElementById("icon-video-off")
door_icon = document.getElementById('icon-door');
presence_icon = document.getElementById('icon-presence');

// Use situations buttons
use_situation_presence_day_button = document.getElementById('us-button-presence-day'); 
use_situation_presence_day_icon = document.getElementById('icon-presence-day');  
use_situation_presence_home_office_button = document.getElementById('us-button-presence-home-office'); 
use_situation_presence_home_office_icon = document.getElementById('icon-presence-homeoffice');  
use_situation_presence_night_button = document.getElementById('us-button-presence-night'); 
use_situation_presence_night_icon = document.getElementById('icon-presence-night');  
use_situation_absence_button = document.getElementById('us-button-absence');
use_situation_absence_icon = document.getElementById('icon-absence');

// Audo notifications
doorbell_notification_audio = document.getElementById("doorbell_audio")

/* Inint values */
let doorbell_blink = false;
let presence_blink = false;
wifi_icon.style.color = "gray";
video_on_icon.style.visibility = "hidden";
video_on_icon.style.color = "orangered";
video_off_icon.style.visibility = "visible";
video_off_icon.style.color = "gray";
door_icon.style.visibility = "hidden";
presence_icon.style.visibility = "hidden";
video_stream.src = loading_frame

/* Blink function icons */
var interval_icons = window.setInterval(function(){
    if(doorbell_blink){
        if(door_icon.style.visibility == 'hidden'){
            door_icon.style.visibility = 'visible';
        }else{
            door_icon.style.visibility = 'hidden';
        }
    }
    else{
        door_icon.style.visibility = 'hidden';
    }
    if(presence_blink){
        if(presence_icon.style.visibility == 'hidden'){
            presence_icon.style.visibility = 'visible';
        }else{
            presence_icon.style.visibility = 'hidden';
        }
    }  
    else{
        presence_icon.style.visibility = 'hidden';
    }
}, 500);

/* Blink function use situations icons */
let setting_use_situation = false;
let current_use_situation = "";
let new_use_situation = ""
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


/* Buttons on click functions  */
get_live_stream_button.onclick = function(){    
    console.log("Get live video stream")
    video_on_icon.style.visibility = "visible";
    video_off_icon.style.visibility = "hidden";
    video_stream.src = url_camera
};

function clear_use_situation_buttons(){
    console.log("clear_use_situation_buttons")
    use_situation_presence_day_icon.style.color = "white";
    use_situation_presence_home_office_icon.style.color = "white";
    use_situation_presence_night_icon.style.color = "white";
    use_situation_absence_icon.style.color = "white";
}
function set_use_situation(use_situation){
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

// Set socket on receive event functions
socket.on("connect", () => { 
    justButton = true;
});

socket.on("wifi_status", (wifi_status) => { 
    console.log("WIFI STATUS: "+ wifi_status)
    if(wifi_status=="True"){
        wifi_icon.style.color = "green";
    }
    else{
        wifi_icon.style.color = "gray";
        video_stream.src = loading_frame
    }
});

socket.on("use_situation", (use_situation) => { 
    console.log("USE SITUATION: "+ use_situation)

    if(new_use_situation==""){
        new_use_situation=use_situation
    }
    if(use_situation==new_use_situation){
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
});

socket.on("alarm_event", (video_stream_status, trigger) => {     
    console.log(video_stream_status)
    if(video_stream_status=="True"){
        if(trigger == "doorbell"){
            doorbell_notification_audio.play();
            doorbell_blink = true;
        }
        else if(trigger == "presence_detection"){
            //TODO: set alarm sound
            doorbell_notification_audio.play();
            presence_blink = true;
        }        
        console.log("Streaming start")
        video_on_icon.style.visibility = "visible";
        video_off_icon.style.visibility = "hidden";
        video_stream.src = url_camera
    }
    else{
        console.log("Streaming end")
        doorbell_blink = false;
        presence_blink = false;        
        video_on_icon.style.visibility = "hidden";
        video_off_icon.style.visibility = "visible";
        video_stream.src = loading_frame
    }
});

