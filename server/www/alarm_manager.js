const socket_alarm = io();

/* Audio notifications */
doorbell_notification_audio = document.getElementById("doorbell_audio")
presence_alarm_audio = document.getElementById("presence_alarm_audio")
presence_icon = document.getElementById('icon-presence');
door_icon = document.getElementById('icon-door');

/* Init values */
let doorbell_blink = false;
let presence_blink = false;
door_icon.style.visibility = "hidden";
presence_icon.style.visibility = "hidden";

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

function set_end_of_alarm(){
    console.log("Streaming end")
    doorbell_blink = false;
    presence_blink = false;        
    stop_video_stream();
}

socket_alarm.on("alarm_event", (trigger) => {
    clear_header_icons();
    if(trigger == "doorbell"){
        doorbell_notification_audio.play();
        doorbell_blink = true;
    }
    else if(trigger == "presence_detection"){
        presence_alarm_audio.play();
        presence_blink = true;
    } 
    // Set video stream start
    setTimeout(start_video_stream, 8000);
    // Set end of alarm (video stream)
    setTimeout(set_end_of_alarm, 38000);
});