const express = require('express')
const bodyParser = require('body-parser');
const {Server} = require("socket.io");
const {createServer} = require("http");

const app = express()
const port = 3001

const httpServer = createServer(app);
const io = new Server(httpServer);
httpServer.listen(port);

app.use(bodyParser.urlencoded({
  limit: '200mb',
  extended: true
}))
app.use(express.static(__dirname + '/www'));

app.post('/status', function(request, response){
  console.log("Received status - wifi:" + request.body.wifi_status + "  use_situation: " + request.body.use_situation)
  io.sockets.emit("wifi_status", request.body.wifi_status);
  io.sockets.emit("use_situation", request.body.use_situation);
  response.send(request.body);    // echo the result back
});

app.post('/alarm_event', function(request, response){
  console.log("Received- Alarm event notification received: " + request.body.trigger)
  io.sockets.emit("alarm_event", request.body.status, request.body.trigger);
  response.send(request.body);    // echo the result back
});

io.on("connection", (socket) => {
  console.log('Connection socket on client web with id : ' + socket.id); 
});