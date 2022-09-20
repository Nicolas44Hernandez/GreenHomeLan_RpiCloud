
const socket = io();

const url_camera = "http://192.168.1.13:5000/video_stream"
const use_situations_url = "http://192.168.1.20:5000/use_situations/current"
const loading_frame = "imgs/default.jpg"

video_stream = document.getElementById("frame")
wifi_on = document.getElementById("wifi_status_on")
wifi_off = document.getElementById("wifi_status_off")
use_situations_button = document.getElementById("use_situations_button")
use_situations_list = document.getElementById("myList");
doorbell_notification_audio = document.getElementById("doorbell_audio")
// set inint values
video_stream.src = loading_frame
wifi_on.style.display ="none";
wifi_off.style.display ="block";

use_situations_button.onclick = function(){    
    let use_situation = use_situations_list.options[use_situations_list.selectedIndex].text;
    console.log("Change use situation to")
    console.log(use_situation)

    let xhr = new XMLHttpRequest();
    let params = "?use_situation=" + use_situation
    xhr.open("POST", use_situations_url+params);

    xhr.setRequestHeader("Accept", "application/json");
    xhr.onload = () => console.log(xhr.responseText);
    xhr.send(null);
};

socket.on("connect", () => { 
    justButton = true;
});

socket.on("wifi_status", (wifi_status) => { 
    console.log(wifi_status)
    if(wifi_status=="True"){
        wifi_on.style.display ="block";
        wifi_off.style.display ="none";
    }
    else{
        wifi_on.style.display ="none";
        wifi_off.style.display ="block";
        video_stream.src = loading_frame
    }
});

socket.on("video_stream", (video_stream_status) => {     
    console.log(video_stream_status)
    if(video_stream_status=="True"){
        doorbell_notification_audio.play();
        console.log("Starting streaming")
        video_stream.src = url_camera
    }
    else{
        console.log("Streaming end")
        video_stream.src = loading_frame
    }
});

