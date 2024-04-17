/* Constants */
const socket_bands = io();
const on_baseline_threshold = 2;
const off_baseline_threshold = 1
var bandStatusYLabels = { 0: 'OFF', 1: 'ON' };

// Get the canvas elements
const canvasBandStatusChart = document.getElementById('bandStatusChart');
// set visible
canvasBandStatusChart.style.visibility = "visible";

// Create the chart
const ctxBandStatusChart = canvasBandStatusChart.getContext('2d');

// Variables
var default_band_2ghz_state_data = [{ x: 0, y: 0 }];
var default_band_5ghz_state_data = [{ x: 0, y: 0 }];
var default_band_5ghz_state_data_baseline = [{ x: 0, y: 0 }];
var baseline_current_band_state = false;


// Charts
const bandStateChart = new Chart(ctxBandStatusChart, {
  data: {
    datasets: [{
      label: '5GHz band',
      stepped: true,
      type: 'line',
      data: default_band_5ghz_state_data,
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'blue',
      pointRadius: pointRadiusBand,
      lineWidth: 0.5,
      borderWidth: borderWidth,
      fill: false
    },
    {
      label: 'baseline',
      stepped: true,
      type: 'line',
      data: default_band_5ghz_state_data_baseline,
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'red',
      pointRadius: pointRadiusBand,
      lineWidth: 0.5,
      borderWidth: borderWidth,
      fill: false
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        beginAtZero: true,
        title: {
          display: true,
          text: 'Sample'
        },
        grid: {
          display: false,
        }
      },
      y: {
        position: 'left',
        beginAtZero: true,
        title: {
          display: true,
          text: 'Status'
        },
        grid: {
          display: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return bandStatusYLabels[value];
          }
        }
      },
    }
  }
});

function get_baseline_band_status(total_traffic) {
  console.log(total_traffic);
  if (baseline_current_band_state){
    if(total_traffic >= off_baseline_threshold){
      return true;
    }
    else{
      return false;
    }
  }
  if (!baseline_current_band_state){
    if(total_traffic > on_baseline_threshold){
      return true;
    }
    else{
      return false;
    }
  }
}


function append_band_status_received_data(band_status, livebox_traffic){

  if (iteration_counter == max_chart_len) {
    bandStateChart.data.datasets.forEach(dataset => {
      dataset.data.shift();
      dataset.data.forEach(element => {
        element.x = element.x -1;
      });
    });  
  }  
  
  console.log("iteartion_counter: " + iteration_counter);

  // Append  received data
  bandStateChart.data.datasets[0].data.push({ x: iteration_counter, y: band_status});

  if (band_status == 1) {
    current_band_state = true;
  }
  else {
    current_band_state = false;
  }

  //baseline band status 
  baseline_band_status = get_baseline_band_status(livebox_traffic)
  bandStateChart.data.datasets[1].data.push({ x: iteration_counter, y: baseline_band_status });
  baseline_current_band_state=baseline_band_status;

  // update charts
  bandStateChart.update();
}

socket_bands.on("band_status", (band_status, livebox_traffic) => {
  console.log("RECEIVED BAND STATUS: " + band_status);
  append_band_status_received_data(band_status, livebox_traffic);
});

