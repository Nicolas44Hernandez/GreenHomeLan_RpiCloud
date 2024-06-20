/* Constants */
const url_camera_1 = "http://192.168.1.42:5000/video_stream"
const url_camera_2 = "http://192.168.1.41:5000/video_stream"
const default_image = "imgs/default.jpg"

/* Elements */
video_stream = document.getElementById("frame");
video_icon = document.getElementById("icon-video");

/* Init values */
video_stream.src = default_image;;
let video_streaming = false;

function start_video_stream_cam1(){
           
    video_icon.style.color = "yellow";
    video_stream.src = url_camera_1;
    console.log("Get live video stream: " + video_stream.src);     
    video_streaming = true;
}

function start_video_stream_cam2(){
           
    video_icon.style.color = "yellow";
    video_stream.src = url_camera_2;
    console.log("Get live video stream: " + video_stream.src);     
    video_streaming = true;
}

function stop_video_stream(){
    console.log("Stop video stream");            
    video_stream.src = default_image;
    video_icon.style.color = "gray";
    video_streaming = false;
}

function hide_image(){
    video_stream.src = null;
    video_icon.style.color = "gray";
    wifi_info.style.visibility = "hidden";
    alimelo_info.style.visibility = "hidden";
    connected_objects_info.style.visibility = "hidden";
    power_strip_info.style.visibility = "hidden";
}