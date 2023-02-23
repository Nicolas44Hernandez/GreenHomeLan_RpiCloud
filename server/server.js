const express = require('express')
const bodyParser = require('body-parser');
const {Server} = require("socket.io");
const {createServer} = require("http");

const app = express()
const port = 3000

const httpServer = createServer(app);
const io = new Server(httpServer);
httpServer.listen(port);

app.use(bodyParser.urlencoded({
  limit: '200mb',
  extended: true
}))
app.use(express.static(__dirname + '/www'));

app.post('/status', function(request, response){
  console.log('Received orchestrator status');
  console.log("Wifi:" + request.body.wifi_status);
  console.log("Use situation: " + request.body.use_situation);
  console.log("Alimelo electric socket status: " + request.body.alimelo_electric_socket_status);
  console.log("Alimelo battery level: " + request.body.alimelo_battery_level);
  io.sockets.emit("wifi_status_general", request.body.wifi_status);
  io.sockets.emit("use_situation", request.body.use_situation);
  io.sockets.emit("alimelo_battery_level", request.body.alimelo_battery_level);
  io.sockets.emit("alimelo_electric_socket_status", request.body.alimelo_electric_socket_status);
  response.send(request.body);    // echo the result back
});

app.post('/alarm', function(request, response){
  console.log("Received- Alarm event notification received: ");
  console.log("trigger: " + request.body.trigger);
  io.sockets.emit("alarm_event", request.body.trigger);
  response.send(request.body);    // echo the result back
});

io.on("connection", (socket) => {
  console.log('Connection socket on client web with id : ' + socket.id); 
});