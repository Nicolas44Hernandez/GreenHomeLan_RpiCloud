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

app.post('/wifi_status', function(request, response){
  console.log("Received - Wifi status: " + request.body.status)
  io.sockets.emit("wifi_status", request.body.status);
  response.send(request.body);    // echo the result back
});

app.post('/use_situation', function(request, response){
  console.log("Received - Current use situation: " + request.body.use_situation)
  io.sockets.emit("use_situation", request.body.use_situation);
  response.send(request.body);    // echo the result back
});

app.post('/doorbell', function(request, response){
  console.log("Received- Doorbell video stream notification received: " + request.body.status)
  io.sockets.emit("video_stream", request.body.status, "doorbell");
  response.send(request.body);    // echo the result back
});

io.on("connection", (socket) => {
  console.log('Connection socket on client web with id : ' + socket.id); 
});