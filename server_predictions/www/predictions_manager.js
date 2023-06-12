/* Constants */
const socket_predictions = io();
const max_chart_len = 120;
const borderWidth=2;
const pointRadius=2;
const pointRadiusBand=0.5;
const pointRadiusRTT=4;
const on_threshold=100;
const off_threshold=50
var bandStatusYLabels = {0 : 'OFF', 1 : 'ON'};
// Get the canvas elements
const canvasStationsTraffic = document.getElementById('stationsTrafficChart');
const canvasLiveBoxTraffic = document.getElementById('liveBoxTrafficChart');
const canvasStationsRttChart = document.getElementById('stationsRttChart');
const canvasBandStatusChart = document.getElementById('bandStatusChart');


canvasStationsTraffic.style.visibility = "visible";
canvasLiveBoxTraffic.style.visibility = "visible";
canvasStationsRttChart.style.visibility = "visible";
canvasBandStatusChart.style.visibility = "visible";


// Create the chart
const ctxStationsTraffic = canvasStationsTraffic.getContext('2d');
const ctxLiveBoxTraffic = canvasLiveBoxTraffic.getContext('2d');
const ctxStationsRttChart = canvasStationsRttChart.getContext('2d');
const ctxBandStatusChart = canvasBandStatusChart.getContext('2d');


// Variables
var default_traffic_data_st1 = [{ x: 0, y: 0 }];
var default_traffic_data_st2 = [{ x: 0, y: 0 }];
var default_traffic_data_lb = [{ x: 0, y: 0 }];
var default_traffic_data_2GHz = [{ x: 0, y: 0 }];
var default_traffic_data_5GHz = [{ x: 0, y: 0 }];
var default_rtt_data_st1= [{ x: 0, y: 0 }];
var default_mean_rtt_data_st1= [{ x: 0, y: 0 }];
var default_mean_rtt_data_st2= [{ x: 0, y: 0 }];
var default_rtt_data_st2= [{ x: 0, y: 0 }];
var default_band_2ghz_state_data= [{ x: 0, y: 0 }];
var default_band_5ghz_state_data= [{ x: 0, y: 0}];
var iteration_counter = 0;
var current_band_state = false;

// Charts
const stationsChart = new Chart(ctxStationsTraffic, {
  // type: 'line', // Specify the chart type (e.g., bar, line, pie)
  data: {
    datasets: [{
      label: 'ST1',
      type: 'line',
      data: default_traffic_data_st1,
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      pointRadius: 2,
      borderWidth:borderWidth,
      fill: false
    },
    {
      label: 'ST2',
      type: 'line',
      data: default_traffic_data_st2,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      pointRadius: 2,
      borderWidth:borderWidth,      
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
          display: true,
          drawOnChartArea: true,
          drawTicks: true,
          color: 'gray',
        }       
      },
      y: {
        type: 'linear',
        position: 'left',
        beginAtZero: true,
        title: {
          display: true,
          text: 'Traffic (Mbps)'
        },
        grid: {
          color: 'gray',
        }
      }
    }
  }
});
const liveBoxChart = new Chart(ctxLiveBoxTraffic, {
  data: {
    datasets: [{
      label: 'Total',
      //stepped: true,      
      type: 'line',
      data: default_traffic_data_lb,
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'orange',
      borderWidth:borderWidth,
      pointRadius: pointRadius,
      fill: false
    },
    {
      label: '2.4GHz',
      //stepped: true,      
      type: 'line',
      data: default_traffic_data_2GHz,
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'green',
      borderWidth:borderWidth,
      pointRadius: pointRadius,
      fill: false
    },
    {
      label: '5GHz',
      //stepped: true,      
      type: 'line',
      data: default_traffic_data_5GHz,
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'blue',
      borderWidth:borderWidth,
      pointRadius: pointRadius,
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
          display: true,
          drawOnChartArea: true,
          drawTicks: true,
          color: 'gray',
        }
      },
      y: {
        type: 'linear',
        position: 'left',
        beginAtZero: true,
        title: {
          display: true,
          text: 'Traffic (Mbps)'
        },
        grid: {
          color: 'gray',
        }
      }
    }
  }
});
const rttStationsChart = new Chart(ctxStationsRttChart, {
  // type: 'line', // Specify the chart type (e.g., bar, line, pie)
  data: {
    datasets: [{
      label: 'ST1',
      type: 'line',
      showLine: false,
      data: default_rtt_data_st1,
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      pointRadius: pointRadiusRTT,
      borderWidth:borderWidth,
      fill: false
    },    
    {
      label: 'ST2',
      type: 'line',
      showLine: false,
      data: default_rtt_data_st2,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      pointRadius: pointRadiusRTT,
      borderWidth:borderWidth,
      fill: false
    },
    {
      label: 'mean RTT ST1',
      type: 'line',
      showLine: true,
      stepped: true,
      data: default_mean_rtt_data_st1,
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      pointRadius: pointRadiusBand,
      borderWidth:borderWidth,
      fill: false
    },
    {
      label: 'mean RTT ST2',
      type: 'line',
      showLine: true,
      stepped: true,
      data: default_mean_rtt_data_st2,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      pointRadius: pointRadiusBand,
      borderWidth:borderWidth,
      fill: false
    },
  ]
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
          display: true,
          drawOnChartArea: true,
          drawTicks: true,
          color: 'gray',
        }
      },
      y: {
        type: 'linear',
        position: 'left',
        beginAtZero: true,
        min: 0,
        max: 200,
        ticks: {
          // forces step size to be 50 units
          stepSize: 25
        },       
        title: {
          display: true,
          text: 'Predicted RTT (ms)'          
        },
        grid: {
          color: function(context){ 
            if(current_band_state){
              if (context.tick.value == off_threshold){
                return 'red';
              }
              else{
                return 'gray'
              }
            }
            else{
              if(context.tick.value == on_threshold){
                return 'green';
              }
              else{
                return 'gray'
              }
            }    
          },
          lineWidth: function(context){ 
            if(current_band_state){
              if (context.tick.value == off_threshold){
                return 3;
              }
              else{
                return 1;
              }
            }
            else{
              if(context.tick.value == on_threshold){
                return 3;
              }
              else{
                return 1;
              }
            }    
          },
        },
      }, 
    },
    annotation: {
      annotations: [
        {
          type: "line",
          mode: "vertical",
          scaleID: "x-axis-0",
          borderColor: "red",
          label: {
            content: "",
            enabled: true,
            position: "top"
          }
        }
      ]
    }
  }
});
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
      lineWidth:0.5,
      borderWidth:borderWidth,
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
          callback: function(value, index, values) {
                  return bandStatusYLabels[value];
              }
        }
      },      
    }
  }
});

function append_rtt_data(rtt_prediction_data){
  if(iteration_counter == max_chart_len){
    stationsChart.data.datasets[0].data.splice(0, 1)
    stationsChart.data.datasets[1].data.splice(0, 1)
    liveBoxChart.data.datasets[0].data.splice(0, 1)
    liveBoxChart.data.datasets[1].data.splice(0, 1)
    liveBoxChart.data.datasets[2].data.splice(0, 1)
    rttStationsChart.data.datasets[0].data.splice(0, 1)
    rttStationsChart.data.datasets[1].data.splice(0, 1)
    rttStationsChart.data.datasets[2].data.splice(0, 1)
    rttStationsChart.data.datasets[3].data.splice(0, 1)
    bandStateChart.data.datasets[0].data.splice(0, 1)

    console.log("Splice OK");

    // new arrays 
    new_st1_traffic = []
    new_st2_traffic = []
    new_lb_traffic = []
    new_2GHz_traffic = []
    new_5GHz_traffic = []
    new_st1_rtt = []
    new_st2_rtt = []
    new_st1_mean_rtt = []
    new_st2_mean_rtt = []
    new_band_status = []

    for (var i = 0; i < max_chart_len; i++) {
      new_st1_traffic.push({ x: i, y: stationsChart.data.datasets[0].data[i].y});
      new_st2_traffic.push({ x: i, y: stationsChart.data.datasets[1].data[i].y});
      new_lb_traffic.push({ x: i, y: liveBoxChart.data.datasets[0].data[i].y});
      new_2GHz_traffic.push({ x: i, y: liveBoxChart.data.datasets[1].data[i].y});
      new_5GHz_traffic.push({ x: i, y: liveBoxChart.data.datasets[2].data[i].y});
      new_st1_rtt.push({ x: i, y: rttStationsChart.data.datasets[0].data[i].y});
      new_st2_rtt.push({ x: i, y: rttStationsChart.data.datasets[1].data[i].y});
      new_st1_mean_rtt.push({ x: i, y: rttStationsChart.data.datasets[2].data[i].y});
      new_st2_mean_rtt.push({ x: i, y: rttStationsChart.data.datasets[3].data[i].y});
      new_band_status.push({ x: i, y: bandStateChart.data.datasets[0].data[i].y}); 
    }

    // console.log("New arrays creation OK");
    console.log("new array: " + JSON.stringify(new_st1_traffic))

    stationsChart.data.datasets[0].data = new_st1_traffic;
    stationsChart.data.datasets[1].data = new_st2_traffic;
    liveBoxChart.data.datasets[0].data = new_lb_traffic;
    liveBoxChart.data.datasets[1].data = new_2GHz_traffic;
    liveBoxChart.data.datasets[2].data = new_5GHz_traffic;
    rttStationsChart.data.datasets[0].data = new_st1_rtt;
    rttStationsChart.data.datasets[1].data = new_st2_rtt;
    rttStationsChart.data.datasets[3].data = new_st1_mean_rtt;
    rttStationsChart.data.datasets[4].data = new_st2_mean_rtt;
    bandStateChart.data.datasets[0].data = new_band_status;
  }
  else{
    iteration_counter = iteration_counter + 1;
  }

  console.log("iteartion_counter: " + iteration_counter);
  
  // console.log("livebox_traffic: " + rtt_prediction_data.livebox_traffic);
  // console.log("station_1_traffic: " + rtt_prediction_data.st1_traffic);
  // console.log("station_2_traffic: " + rtt_prediction_data.st2_traffic);  
  console.log("st1_rtt: " + rtt_prediction_data.st1_rtt);
  console.log("st1_mean_rtt: " + rtt_prediction_data.st1_mean_rtt);
  console.log("st2_rtt: " + rtt_prediction_data.st2_rtt);
  console.log("st2_mean_rtt: " + rtt_prediction_data.st2_mean_rtt);

  // console.log("station_2_rtt: " + rtt_prediction_data.st2_rtt);
  // console.log("5GHz status: " + rtt_prediction_data.band_5ghz_status);

  // Append station 1 traffic data
  stationsChart.data.datasets[0].data.push({ x: iteration_counter, y: rtt_prediction_data.st1_traffic});
  //console.log("current traffic data station_1: " + JSON.stringify(stationsChart.data.datasets[0].data)); 

  // Append station 2 traffic data   
  stationsChart.data.datasets[1].data.push({ x: iteration_counter, y: rtt_prediction_data.st2_traffic});
  //console.log("current traffic data station_2: " + JSON.stringify(stationsChart.data.datasets[1].data)); 

  // Append livebox traffic data
  liveBoxChart.data.datasets[0].data.push({ x: iteration_counter, y: rtt_prediction_data.livebox_traffic});
  //console.log("current traffic data livebox: " + JSON.stringify(liveBoxChart.data.datasets[0].data)); 

  // Append 2.4GHz traffic data
  liveBoxChart.data.datasets[1].data.push({ x: iteration_counter, y: rtt_prediction_data.traffic_2GHz});
  //console.log("current 2.4 GHz traffic data: " + JSON.stringify(liveBoxChart.data.datasets[1].data)); 

  // Append 5GHz traffic data
  liveBoxChart.data.datasets[2].data.push({ x: iteration_counter, y: rtt_prediction_data.traffic_5GHz});
  //console.log("current 5 GHz traffic data: " + JSON.stringify(liveBoxChart.data.datasets[2].data)); 

  // Append station 1 rtt data
  rttStationsChart.data.datasets[0].data.push({ x: iteration_counter, y: rtt_prediction_data.st1_rtt});
  //console.log("current rtt data station_1: " + JSON.stringify(rttStationsChart.data.datasets[0].data)); 

  // Append station 2 rtt data
  rttStationsChart.data.datasets[1].data.push({ x: iteration_counter, y: rtt_prediction_data.st2_rtt});
  //console.log("current rtt data station_2: " + JSON.stringify(rttStationsChart.data.datasets[1].data)); 
  
  // Append station 1 mean rtt data
  rttStationsChart.data.datasets[2].data.push({ x: iteration_counter, y: rtt_prediction_data.st1_mean_rtt});
  //console.log("current mean rtt data station_1: " + JSON.stringify(rttStationsChart.data.datasets[2].data)); 

  // Append station 2 mean rtt data
  rttStationsChart.data.datasets[3].data.push({ x: iteration_counter, y: rtt_prediction_data.st2_mean_rtt});
  //console.log("current mean rtt data station_2: " + JSON.stringify(rttStationsChart.data.datasets[3].data)); 

  // Append  5GHz band status data
  bandStateChart.data.datasets[0].data.push({ x: iteration_counter, y: rtt_prediction_data.band_5ghz_status});
  if(rtt_prediction_data.band_5ghz_status == 1){
    current_band_state = true;
  }
  else{
    current_band_state = false;
  }
  //console.log("current 5GHz band status data: " + JSON.stringify(bandStateChart.data.datasets[0].data)); 

  // update charts
  stationsChart.update(); 
  liveBoxChart.update();  
  rttStationsChart.update();  
  bandStateChart.update();
}

socket_predictions.on("traffic_notification", (traffic_data) => { 
  console.log("RECEIVED TRAFFIC NOTIFICATION: "+ traffic_data)
  append_traffic_data(traffic_data);     
});

socket_predictions.on("rtt_prediction_notification", (rtt_prediction_data) => { 
  console.log("RECEIVED RTT PREDICTION NOTIFICATION: "+ rtt_prediction_data)
  append_rtt_data(rtt_prediction_data);     
});

