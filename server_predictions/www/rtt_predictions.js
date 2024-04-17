/* Constants */
const socket_rtt = io();

// Get the canvas elements
const canvasStationsRttChart = document.getElementById('stationsRttChart');
// set visible
canvasStationsRttChart.style.visibility = "visible";

// Create the chart
const ctxStationsRttChart = canvasStationsRttChart.getContext('2d');

// Charts
const rttStationsChart = new Chart(ctxStationsRttChart, {
  // type: 'line', // Specify the chart type (e.g., bar, line, pie)
  data: {
    datasets: []
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
        max: 150,
        ticks: {
          // forces step size to be 50 units
          stepSize: 25
        },
        title: {
          display: true,
          text: 'Predicted RTT (ms)'
        },
        grid: {
          color: function (context) {
            if (context.tick.value == on_threshold) {
                  return 'red';
                }
                else {
                  return 'gray'
                }
          },
          lineWidth: function (context) {
            if (current_band_state) {
              if (context.tick.value == off_threshold) {
                return 3;
              }
              else {
                return 1;
              }
            }
            else {
              if (context.tick.value == on_threshold) {
                return 3;
              }
              else {
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

function append_rtt_received_data(received_data) {

  if (iteration_counter == max_chart_len) {
    rttStationsChart.data.datasets.forEach(dataset => {
      dataset.data.shift();
      dataset.data.forEach(element => {
        element.x = element.x -1;
      });
    });  
  }    
  
  console.log("iteartion_counter: " + iteration_counter);

  //Iterate over stations received
  received_data.forEach(station =>{
    //Check if station mac already exists in dataset
    const macInDataset = (dataset) => dataset.label == station.mac;    
    var idx_in_dataset = rttStationsChart.data.datasets.findLastIndex(macInDataset);
    
    //Station already in dataset
    if(idx_in_dataset >= 0){
      console.log("Station " + station.mac + " already in dataset");  
      console.log("idx: " +idx_in_dataset );
      rttStationsChart.data.datasets[idx_in_dataset].data.push({ x: iteration_counter, y: station.rtt});
    }
    // New station
    else{
      console.log("New station" + station.mac);      
      // fill chart arrays until current iteration
      var new_station_rtt_data = []
      for (var i = 0; i < iteration_counter; i++) {
        new_station_rtt_data.push({ x: i, y: 0 });
      }
      new_station_rtt_data.push({ x: iteration_counter, y: station.rtt})
      const new_dataset = {
        label: station.mac,
        type: 'line',
        data: new_station_rtt_data,
        backgroundColor: colors[rttStationsChart.data.datasets.length].backgroundColor,
        borderColor: colors[rttStationsChart.data.datasets.length].borderColor,
        pointRadius: 2,
        borderWidth: borderWidth,
        fill: false
      }
      rttStationsChart.data.datasets.push(new_dataset);
    }
  });

  // update charts
  rttStationsChart.update();
}

socket_stations.on("stations_rtt", (received_data) => {
  console.log("RECEIVED STATIONS RTT: " + received_data)
  append_rtt_received_data(received_data);
});

