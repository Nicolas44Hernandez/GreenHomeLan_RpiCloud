/* Constants */
const socket_predictions = io();
const max_chart_len = 150;
const borderWidth = 2;
const pointRadius = 2;
const pointRadiusBand = 0.5;
const pointRadiusRTT = 4;
const on_threshold = 50;
const off_threshold = 50;
const colors = [
  { backgroundColor: 'rgba(75, 192, 192, 0.2)', borderColor: 'rgba(75, 192, 192, 1)' },
  { backgroundColor: 'rgba(255, 99, 132, 0.2)', borderColor: 'rgba(255, 99, 132, 1)' },
  { backgroundColor: 'rgba(192, 75, 192, 0.2)', borderColor: 'rgba(192, 75, 192, 1)' },
  { backgroundColor: 'rgba(50, 192, 75, 0.2)', borderColor: 'rgba(50, 192, 75, 1)' },
  { backgroundColor: 'rgba(255, 184, 48, 0.2)', borderColor: 'rgba(255, 184, 48, 1)' },
]

//const base_service_status_url = 'http://192.168.1.20:5000/smart_band'; // RPI box
//const base_service_status_url = 'http://192.168.1.19:5000/smart_band'; //virtual machine
const base_service_status_url = 'localhost:5000/smart_band'; //virtual machine
/* Slider Info section  */
toogle_service_status = document.getElementById("toogle-service");
toogle_service_status.checked = false;

// Variables
var iteration_counter = 0;
var current_band_state = false;

/* Service state toogle on event functions  */
function set_toogles_on_event() {
  toogle_service_status.addEventListener("change", function () {
    console.log("Set service status: " + this.checked);
    set_service_status(this.checked);
  });
}
set_toogles_on_event();

function set_service_status(new_status) {
  console.log("Changing service status to: "+ new_status);
  // query params
  const params = { status: new_status };
  // convert the object to a query string
  const queryString = Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  // construct the final URL with the query string
  const url = `${base_service_status_url}?${queryString}`;
  console.log("url: " + url);

  // send the request and wait for the response
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url);
  xhr.setRequestHeader("Accept", "*/*");
  xhr.send(null);

  xhr.onload = function () {
    const response_json = JSON.parse(xhr.responseText);
    const received_new_status = response_json.status;
    if (xhr.status === 200 && received_new_status == new_status) {
      toogle_service_status.checked = new_status;
    } else {
      toogle_service_status.checked = !new_status;
      console.error("Error:", xhr.statusText);
    }
  };
  xhr.onerror = function () {
    console.error("Network error");
    toogle_service_status.checked = !new_status;  };
}

socket_predictions.on("rtt_prediction_service_status", (service_status) => {
  console.log("RECEIVED PREDICTION SERVICE STATUS: " + service_status);
  toogle_service_status.checked = service_status; 
});

