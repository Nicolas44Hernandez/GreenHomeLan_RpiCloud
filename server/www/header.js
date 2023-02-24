
/* Constants */
const socket = io();

/* Header icons */
home_icon = document.getElementById("icon-home");
wifi_icon = document.getElementById("icon-wifi");
video_icon = document.getElementById("icon-video");
plug_icon = document.getElementById("icon-plug");
alimelo_battery_100_icon = document.getElementById("icon-alimelo-battery-100");
alimelo_battery_75_icon = document.getElementById("icon-alimelo-battery-75");
alimelo_battery_50_icon = document.getElementById("icon-alimelo-battery-50");
alimelo_battery_25_icon = document.getElementById("icon-alimelo-battery-25");
alimelo_battery_0_icon = document.getElementById("icon-alimelo-battery-0");

/* Inint values */
let alimelo_battery_level = 100;
// Header icons
home_icon.style.color = "gray";
home_icon.style.visibility = "visible";
wifi_icon.style.color = "gray";
video_icon.style.visibility = "visible";
video_icon.style.color = "gray";
plug_icon.style.visibility = "visible";
plug_icon.style.color = "gray";

// Battery icons
alimelo_battery_100_icon.style.visibility = "hidden";
alimelo_battery_100_icon.style.color = "green";
alimelo_battery_75_icon.style.visibility = "hidden";
alimelo_battery_75_icon.style.color = "green";
alimelo_battery_50_icon.style.visibility = "hidden";
alimelo_battery_50_icon.style.color = "yellow";
alimelo_battery_25_icon.style.visibility = "hidden";
alimelo_battery_25_icon.style.color = "yellow";
alimelo_battery_0_icon.style.visibility = "hidden";
alimelo_battery_0_icon.style.color = "red";

// Set overlapped container for info
video_stream_frame = document.getElementById("frame")
overlay = document.getElementById('overlapped_wifi');
const iframeRect = video_stream_frame.getBoundingClientRect();
const constant_top = iframeRect.top + 70;
const constant_left = iframeRect.top + 110;
const constant_width = iframeRect.width - 220;
const constant_height = iframeRect.height - 80;
overlay.style.top = constant_top + 'px';
overlay.style.left = constant_left + 'px';
overlay.style.width = constant_width + 'px';
overlay.style.height = constant_height + 'px';

function clear_header_icons(){
    wifi_info.style.visibility = "hidden";
    hide_image();
    home_icon.style.color = "gray";
    video_icon.style.color = "gray";
    wifi_icon.style.color = "gray";
    plug_icon.style.color = "gray";
}

/* Buttons on click functions  */
function set_buttons_on_click(){
    home_icon.onclick = function(){        
        hide_image();
        stop_video_stream();        
    }
    wifi_icon.onclick = function(){
        hide_image();
        wifi_info.style.visibility = "visible";
    }
    video_icon.onclick = function(){   
        hide_image();         
        if(!video_streaming){
            start_video_stream();
        }
        else{
            stop_video_stream();
        }        
    }
    plug_icon.onclick = function(){
        hide_image();
    }    
}
set_buttons_on_click()

/* Set socket on receive event functions */
socket.on("home_connected", (connected) => {     
    console.log("HOME CONNETED: "+ connected);
    if(connected){
        home_icon.style.color = "green";
    }
    else{
        home_icon.style.color = "red";
    }
});

socket.on("wifi_status_general", (wifi_status) => {     
    console.log("WIFI STATUS: "+ wifi_status);
    if(wifi_status=="True"){
        wifi_icon.style.color = "green";
    }
    else{
        wifi_icon.style.color = "gray";
    }
});

socket.on("alimelo_electric_socket_status", (socket_status) => { 
    if(socket_status == "unknown"){
        return;
    }
    console.log("ALIMELO SOCKET STATUS: "+ socket_status)
    if(socket_status=="True"){
        plug_icon.style.color = "green";
    }
    else{
        plug_icon.style.color = "red";
    }
});

socket.on("alimelo_battery_level", (battery_level) => { 
    if(battery_level == "unknown"){
        return;
    }
    console.log("ALIMELO BATTERY PERCENTAGE: "+ battery_level);
    
    const alimelo_battery_100_icon = document.getElementById("icon-alimelo-battery-100");
    const alimelo_battery_75_icon = document.getElementById("icon-alimelo-battery-75");
    const alimelo_battery_50_icon = document.getElementById("icon-alimelo-battery-50");
    const alimelo_battery_25_icon = document.getElementById("icon-alimelo-battery-25");
    const alimelo_battery_0_icon = document.getElementById("icon-alimelo-battery-0");

    if (battery_level >= 75) {
        console.log("ALIMELO >75");
        alimelo_battery_100_icon.style.visibility= "visible";
        alimelo_battery_75_icon.style.visibility= "hidden";
        alimelo_battery_50_icon.style.visibility= "hidden";
        alimelo_battery_25_icon.style.visibility= "hidden";
        alimelo_battery_0_icon.style.visibility= "hidden";
    } else if (battery_level >= 50) {
        console.log("ALIMELO >50");
        alimelo_battery_100_icon.style.visibility= "hidden";
        alimelo_battery_75_icon.style.visibility= "visible";
        alimelo_battery_50_icon.style.visibility= "hidden";
        alimelo_battery_25_icon.style.visibility= "hidden";
        alimelo_battery_0_icon.style.visibility= "hidden";
    } else if (battery_level >= 25) {
        console.log("ALIMELO >25");
        alimelo_battery_100_icon.style.visibility= "hidden";
        alimelo_battery_75_icon.style.visibility= "hidden";
        alimelo_battery_50_icon.style.visibility= "visible";
        alimelo_battery_25_icon.style.visibility= "hidden";
        alimelo_battery_0_icon.style.visibility= "hidden";
    } else if (battery_level >= 10) {
        console.log("ALIMELO >10");
        alimelo_battery_100_icon.style.visibility= "hidden";
        alimelo_battery_75_icon.style.visibility= "hidden";
        alimelo_battery_50_icon.style.visibility= "hidden";
        alimelo_battery_25_icon.style.visibility= "visible";
        alimelo_battery_0_icon.style.visibility= "hidden";
    } else {
        console.log("ALIMELO <1075");
        alimelo_battery_100_icon.style.visibility= "hidden";
        alimelo_battery_75_icon.style.visibility= "hidden";
        alimelo_battery_50_icon.style.visibility= "hidden";
        alimelo_battery_25_icon.style.visibility= "hidden";
        alimelo_battery_0_icon.style.visibility= "visible";
    }    
});


