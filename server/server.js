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

function strictBoolean(str) {
  return str.toLowerCase() === "true";
}

app.post('/status', function(request, response){
  console.log('Received orchestrator status');
  console.log("Wifi status:" + request.body.wifi_status);
  console.log("Wifi 2.4GHz status:" + request.body.band_2GHz_status);
  console.log("Wifi 5GHz status:" + request.body.band_5GHz_status);  
  console.log("Wifi 6GHz status:" + request.body.band_2GHz_status);
  console.log("Use situation: " + request.body.use_situation);
  console.log("Alimelo electric socket status: " + request.body.alimelo_power_supplied);
  console.log("Alimelo battery level: " + request.body.alimelo_battery_level);
  console.log("Alimelo alimelo_current_mA: " + request.body.alimelo_current_mA);
  console.log("Power Outlet 0 status: " + request.body.po0_status);
  console.log("Power Outlet 0 powered: " + request.body.po0_powered);
  console.log("Power Outlet 1 status: " + request.body.po1_status);
  console.log("Power Outlet 1 powered: " + request.body.po1_powered);
  console.log("Power Outlet 2 status: " + request.body.po2_status);
  console.log("Power Outlet 2 powered: " + request.body.po2_powered);
  io.sockets.emit("home_connected", true);
  io.sockets.emit("wifi_status_general", request.body.wifi_status);
  io.sockets.emit(
    "wifi_status_detail", 
    Boolean(strictBoolean(request.body.wifi_status)),
    Boolean(strictBoolean(request.body.band_2GHz_status)), 
    Boolean(strictBoolean(request.body.band_5GHz_status)), 
    Boolean(strictBoolean(request.body.band_6GHz_status)),
  );
  io.sockets.emit("use_situation", request.body.use_situation);
  io.sockets.emit("alimelo_battery_level", request.body.alimelo_battery_level);
  io.sockets.emit("alimelo_electric_socket_status", request.body.alimelo_power_supplied);
  io.sockets.emit(
    "alimelo_status_detail",    
    Number(request.body.alimelo_busvoltage),
    Number(request.body.alimelo_shuntvoltage),
    Number(request.body.alimelo_loadvoltage),
    Number(request.body.alimelo_current_mA),
    Number(request.body.alimelo_power_mW),
    Number(request.body.alimelo_battery_level),
    Boolean(strictBoolean(request.body.alimelo_power_supplied)),
    Boolean(strictBoolean(request.body.alimelo_is_powered_by_battery)),
    Boolean(strictBoolean(request.body.alimelo_is_charging)),
  );
  io.sockets.emit(
    "power_outlets_status", 
    Boolean(strictBoolean(request.body.po0_status)),
    Boolean(strictBoolean(request.body.po1_status)),
    Boolean(strictBoolean(request.body.po2_status)),
  );
  response.send(request.body);    // echo the result back
});

app.post('/alarm', function(request, response){
  console.log("Received- Alarm event notification received: ");
  console.log("alarm_type: " + request.body.alarm_type);
  io.sockets.emit("alarm_event", request.body.alarm_type);
  response.send(request.body);    // echo the result back
});

app.post('/objects', function(request, response){
  console.log("Received- Objects status received: ");
  console.log("device: " + request.body.device);
  console.log("type: " + request.body.type);
  console.log("batLevel: " + request.body.batLevel);
  io.sockets.emit("device_connected", true);
  if(request.body.type == "button"){
    io.sockets.emit("button_battery_level", request.body);
  }
  response.send(request.body);    // echo the result back
});

app.post('/thread_nodes', function(request, response){
  io.sockets.emit("thread_connected_nodes_keep_alive", request.body);  
  response.send(request.body);    // echo the result back
});

io.on("connection", (socket) => {
  console.log('Connection socket on client web with id : ' + socket.id); 
});