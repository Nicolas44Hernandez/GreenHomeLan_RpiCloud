const express = require('express')
const bodyParser = require('body-parser');
const {Server} = require("socket.io");
const {createServer} = require("http");

const app = express()
const port = 22000

const httpServer = createServer(app);
const io = new Server(httpServer);
httpServer.listen(port);

app.use(bodyParser.urlencoded({
  limit: '200mb',
  extended: true
}))
app.use(express.static(__dirname + '/www'));

function strictBoolean(str) {
  return str.toLowerCase() === "true";
}

app.post('/rtt_prediction', function(request, response){
  console.log('Received rtt prediction');
  var rtt_prediction_data = {
    livebox_traffic: parseFloat(request.body.livebox_traffic),
    traffic_5GHz: parseFloat(request.body.traffic_5GHz),
    traffic_2GHz: parseFloat(request.body.traffic_2GHz),
    band_5ghz_status: parseFloat(request.body.band_5ghz_status),
    stations_counters: JSON.parse(request.body.stations_counters),    
  } 
  io.sockets.emit(
    "box_traffic", 
    rtt_prediction_data.livebox_traffic, 
    rtt_prediction_data.traffic_5GHz, 
    rtt_prediction_data.traffic_2GHz,
  );  
  io.sockets.emit("stations_traffic", rtt_prediction_data.stations_counters);  
  io.sockets.emit("stations_rtt", rtt_prediction_data.stations_counters);  
  io.sockets.emit(
    "band_status", 
    rtt_prediction_data.band_5ghz_status, 
    rtt_prediction_data.livebox_traffic, 
  );  
  
  response.send(request.body);    // echo the result back
});

app.post('/rtt_prediction_service', function(request, response){
  console.log('Received predictionservice status');
  console.log(request.body);
  var service_status_data = {
    rtt_prediction_service_status: Boolean(strictBoolean(request.body.status)), 
  } 
  console.log(service_status_data);
  io.sockets.emit("rtt_prediction_service_status", service_status_data.rtt_prediction_service_status);  
  response.send(request.body);    // echo the result back
});


io.on("connection", (socket) => {
  console.log('Connection socket on client web with id : ' + socket.id); 
});