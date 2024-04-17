/* Constants */
const socket_box = io();

// Get the canvas elements
const canvasLiveBoxTraffic = document.getElementById('liveBoxTrafficChart');

// set visible
canvasLiveBoxTraffic.style.visibility = "visible";

// Create the chart
const ctxLiveBoxTraffic = canvasLiveBoxTraffic.getContext('2d');

// Variables
var default_traffic_data_lb = [{ x: 0, y: 0 }];
var default_traffic_data_2GHz = [{ x: 0, y: 0 }];
var default_traffic_data_5GHz = [{ x: 0, y: 0 }];

// Charts
const liveBoxChart = new Chart(ctxLiveBoxTraffic, {
  data: {
    datasets: [{
      label: 'Total',
      //stepped: true,      
      type: 'line',
      data: default_traffic_data_lb,
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'orange',
      borderWidth: borderWidth,
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
      borderWidth: borderWidth,
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
      borderWidth: borderWidth,
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

function append_box_traffic_received_data(livebox_traffic, traffic_5GHz, traffic_2GHz){

  if (iteration_counter == max_chart_len) {
    liveBoxChart.data.datasets.forEach(dataset => {
      dataset.data.shift();
      dataset.data.forEach(element => {
        element.x = element.x -1;
      });
    });  
  }
  else{
    iteration_counter = iteration_counter + 1;
  }  
  
  console.log("iteartion_counter: " + iteration_counter);

  // Append  received data
  liveBoxChart.data.datasets[0].data.push({ x: iteration_counter, y: livebox_traffic});
  liveBoxChart.data.datasets[1].data.push({ x: iteration_counter, y: traffic_2GHz});
  liveBoxChart.data.datasets[2].data.push({ x: iteration_counter, y: traffic_5GHz});

  // update charts
  liveBoxChart.update();
}

socket_box.on("box_traffic", (livebox_traffic, traffic_5GHz, traffic_2GHz) => {
  console.log("RECEIVED BOX TRAFFIC COUNTERS  COUNTERS: ");
  append_box_traffic_received_data(livebox_traffic, traffic_5GHz, traffic_2GHz);
});