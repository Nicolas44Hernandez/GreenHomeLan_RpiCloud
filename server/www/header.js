
/* Constants */
const socket = io();

/* Header icons */
home_icon = document.getElementById("icon-home");
wifi_icon = document.getElementById("icon-wifi");
video_icon = document.getElementById("icon-video");
plug_icon = document.getElementById("icon-plug");
power_strip_icon = document.getElementById("icon-power-strip");
objects_icon = document.getElementById("icon-objects");
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
power_strip_icon.style.visibility = "visible";
power_strip_icon.style.color = "gray";
objects_icon.style.visibility = "visible";
objects_icon.style.color = "gray";

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

// Set overlapped containers for info
video_stream_frame = document.getElementById("frame")
overlay_wifi = document.getElementById('overlapped_wifi');
overlay_alimelo = document.getElementById('overlapped_alimelo');
overlay_power_strip = document.getElementById('overlapped_power_strip');
overlay_objects = document.getElementById('overlapped_objects');
const iframeRect = video_stream_frame.getBoundingClientRect();

// Set wifi overlapped container dimensions
overlay_wifi.style.top = iframeRect.top + 70 + 'px';
overlay_wifi.style.left = iframeRect.left + 160 + 'px';
overlay_wifi.style.width = iframeRect.width - 220 + 'px';
overlay_wifi.style.height = iframeRect.height - 80 + 'px';

// Set alimelo overlapped container dimensions
overlay_alimelo.style.top = iframeRect.top + 'px';
overlay_alimelo.style.left = iframeRect.left + 'px';
overlay_alimelo.style.width = iframeRect.width + 'px';
overlay_alimelo.style.height = iframeRect.height + 'px';

// Set power strip overlapped container dimensions
overlay_power_strip.style.top = iframeRect.top + 'px';
overlay_power_strip.style.left = iframeRect.left + 'px';
overlay_power_strip.style.width = iframeRect.width + 'px';
overlay_power_strip.style.height = iframeRect.height + 'px';

// Set connected objects overlapped container dimensions
overlay_objects.style.top = iframeRect.top + 'px';
overlay_objects.style.left = iframeRect.left + 'px';
overlay_objects.style.width = iframeRect.width + 'px';
overlay_objects.style.height = iframeRect.height + 'px';

function clear_header_icons(){
    wifi_info.style.visibility = "hidden";
    hide_image();
    home_icon.style.color = "gray";
    video_icon.style.color = "gray";
    wifi_icon.style.color = "gray";
    plug_icon.style.color = "gray";
    power_strip_icon.style.color = "gray";
    objects_icon.style.comor = "gray";
}

function deep_sleep(){
    clear_header_icons();
    hide_image();
    stop_video_stream(); 
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
            start_video_stream_cam1();
        }
        else{
            stop_video_stream();
        }        
    }
    plug_icon.onclick = function(){
        hide_image();
        alimelo_info.style.visibility = "visible";
    }  
    power_strip_icon.onclick = function(){
        hide_image();
        power_strip_info.style.visibility = "visible";
    }
    objects_icon.onclick = function(){
        hide_image();
        connected_objects_info.style.visibility = "visible";
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

socket.on("power_received", (energy_limitations) => { 
    if(energy_limitations == "unknown"){
        return;
    }
    console.log("ENERGY LIMITATION: "+ energy_limitations)
    if(energy_limitations=="100%"){
        plug_icon.style.color = "green";
    }
    else if(energy_limitations=="25%"){
        plug_icon.style.color = "yellow";
    }
    else{
        plug_icon.style.color = "red";
    }
});

socket.on("power_strip_status", (relay1_status, relay2_status, relay3_status, relay4_status) => { 
    if((relay1_status == "unknown") || (relay2_status == "unknown") || (relay3_status == "unknown") || (relay4_status == "unknown")){
        power_strip_icon.style.color = "red";
    }
    else {
        power_strip_icon.style.color = "green";
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

socket.on("device_connected", (connected) => {     
    console.log("BUTTON CONNETED: "+ connected);
    if(connected){
        objects_icon.style.color = "green";
    }
    else{
        objects_icon.style.color = "red";
    }
});

socket_wifi.on("deep_sleep", () => { 
    deep_sleep();
});