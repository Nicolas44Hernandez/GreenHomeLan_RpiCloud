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
  console.log("Wifi status received:")
  console.log(request.body.status); 
  io.sockets.emit("wifi_status", request.body.status);
  response.send(request.body);    // echo the result back
});

app.post('/doorbell', function(request, response){
  console.log("Doorbell: video stream notification received:")
  console.log(request.body.status); 
  io.sockets.emit("video_stream", request.body.status);
  response.send(request.body);    // echo the result back
});

io.on("connection", (socket) => {
  console.log('Connection socket on client web with id : ' + socket.id); 
});