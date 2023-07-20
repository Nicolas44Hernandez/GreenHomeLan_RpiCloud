const socket_objects = io();

/* Connected objects info section  */
connected_objects_info = document.getElementById('overlapped_objects');
connected_objects_info.style.visibility = "hidden";

// Connected objects status values
button1_batery_level = document.getElementById('button1-battery-level');
button2_batery_level = document.getElementById('button2-battery-level');

/* Set init values */
button1_batery_level.textContent = "n/a";
button2_batery_level.textContent = "n/a";

socket_alimelo.on("button_battery_level", (body) => { 
    let device = body.device;
    let batLevel = body.batLevel;
if(batLevel != null){
    console.log("device:"+ device +"  batLevel:" + batLevel);
    if(device==1){
        console.log("Updatting for device 1")
        button1_batery_level.textContent = batLevel + " %";
    }
    if(device==2){
        console.log("Updatting for device 2")
        button2_batery_level.textContent = batLevel + " %";
    }
}                  
});
