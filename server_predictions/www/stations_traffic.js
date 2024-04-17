/* Constants */
const socket_stations = io();

// Get the canvas elements
const canvasStationsTraffic = document.getElementById('stationsTrafficChart');

// set visible
canvasStationsTraffic.style.visibility = "visible";

// Create the chart
const ctxStationsTraffic = canvasStationsTraffic.getContext('2d');

// Charts
const stationsChart = new Chart(ctxStationsTraffic, {
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

function append_received_data(received_data) {

  if (iteration_counter == max_chart_len) {
    stationsChart.data.datasets.forEach(dataset => {
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
    var idx_in_dataset = stationsChart.data.datasets.findLastIndex(macInDataset);
    
    //Station already in dataset
    if(idx_in_dataset >= 0){
      console.log("Station " + station.mac + " already in dataset");  
      console.log("idx: " +idx_in_dataset );
      stationsChart.data.datasets[idx_in_dataset].data.push({ x: iteration_counter, y: station.traffic_Mbps});
    }
    // New station
    else{
      console.log("New station" + station.mac);      
      // fill chart arrays until current iteration
      var new_station_traffic_data = []
      for (var i = 0; i < iteration_counter; i++) {
        new_station_traffic_data.push({ x: i, y: 0 });
      }
      new_station_traffic_data.push({ x: iteration_counter, y: station.traffic_Mbps})
      const new_dataset = {
        label: station.mac,
        type: 'line',
        data: new_station_traffic_data,
        backgroundColor: colors[stationsChart.data.datasets.length].backgroundColor,
        borderColor: colors[stationsChart.data.datasets.length].borderColor,
        pointRadius: 2,
        borderWidth: borderWidth,
        fill: false
      }
      stationsChart.data.datasets.push(new_dataset);
    }
  });

  // update charts
  stationsChart.update();
}


socket_stations.on("stations_traffic", (received_data) => {
  console.log("RECEIVED STATIONS COUNTERS: " + received_data)
  append_received_data(received_data);
});
