const socket_alarm = io();

/* Audio notifications */
doorbell_notification_audio = document.getElementById("doorbell_audio")
presence_alarm_audio = document.getElementById("presence_alarm_audio")
presence_icon = document.getElementById('icon-presence');
emergency_icon = document.getElementById('icon-emergency');
battery_button_icon = document.getElementById('icon-battery');
battery_button_number_icon = document.getElementById('icon-number');
low_power_icon = document.getElementById("icon-low-power");
door_icon = document.getElementById('icon-door');

/* Init values */
let doorbell_blink = false;
let presence_blink = false;
let emergency_blink = false;
let battery_button_blink = false;
let socket_blink = false;
door_icon.style.visibility = "hidden";
presence_icon.style.visibility = "hidden";
emergency_icon.style.visibility = "hidden";
battery_button_icon.style.visibility = "hidden";
battery_button_number_icon.style.visibility = "hidden";
low_power_icon.style.visibility = "hidden";

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
    if(emergency_blink){
        if(emergency_icon.style.visibility == 'hidden'){
            emergency_icon.style.visibility = 'visible';
        }else{
            emergency_icon.style.visibility = 'hidden';
        }
    }  
    else{
        emergency_icon.style.visibility = 'hidden';
    }
    if(battery_button_blink){
        if(battery_button_icon.style.visibility == 'hidden'){
            battery_button_icon.style.visibility = 'visible';
            battery_button_number_icon.style.visibility = 'visible';
        }else{
            battery_button_icon.style.visibility = 'hidden';
            battery_button_number_icon.style.visibility = 'hidden';
        }
    }  
    else{
        battery_button_icon.style.visibility = 'hidden';
        battery_button_number_icon.style.visibility = 'hidden'
    }
    if(socket_blink){
        if(low_power_icon.style.visibility == 'hidden'){
            low_power_icon.style.visibility = 'visible';
        }else{
            low_power_icon.style.visibility = 'hidden';
        }
    }  
    else{
        low_power_icon.style.visibility = 'hidden';
    }
}, 500);

function set_end_of_alarm(){
    console.log("Streaming end")
    doorbell_blink = false;
    presence_blink = false;  
    emergency_blink = false; 
    battery_button_blink = false; 
    socket_blink = false;      
    stop_video_stream();
}

socket_alarm.on("alarm_event", (trigger) => {    
    if(trigger == "doorbell"){
        console.log("Alarm doorbell");
        clear_header_icons();
        doorbell_notification_audio.play();
        doorbell_blink = true;
        // Set video stream start
        setTimeout(start_video_stream, 8000);
        // Set end of alarm (video stream)
        setTimeout(set_end_of_alarm, 38000);
    }
    else if(trigger == "presence_detection"){
        clear_header_icons();
        presence_alarm_audio.play();
        presence_blink = true;
        // Set video stream start
        setTimeout(start_video_stream, 8000);
        // Set end of alarm (video stream)
        setTimeout(set_end_of_alarm, 38000);
    } 
    else if(trigger == "emergency_btn"){
        clear_header_icons();
        // TODO: change audio (?)
        presence_alarm_audio.play();
        emergency_blink = true;
        // Set end of alarm (video stream)
        setTimeout(set_end_of_alarm, 10000);
    } 
    else if(trigger == "battery_btn_1"){
        clear_header_icons();
        // TODO: change audio (?)
        presence_alarm_audio.play();
        battery_button_number_icon.classList.remove("fa-2");
        battery_button_number_icon.classList.add("fa-1");
        battery_button_blink = true;        
        // Set end of alarm (video stream)
        setTimeout(set_end_of_alarm, 10000);
    } 
    else if(trigger == "battery_btn_2"){
        clear_header_icons();
        // TODO: change audio
        presence_alarm_audio.play();
        battery_button_number_icon.classList.remove("fa-1");
        battery_button_number_icon.classList.add("fa-2");
        battery_button_blink = true;
        // Set end of alarm (video stream)
        setTimeout(set_end_of_alarm, 10000);
    } 
    else if(trigger == "low_power"){
        // TODO: set sound
        presence_alarm_audio.play();
        socket_blink = true;
        // Set end of alarm
        setTimeout(set_end_of_alarm, 30000);
    }
    
});