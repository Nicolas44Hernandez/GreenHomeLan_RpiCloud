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
  console.log("Orchestrator base url:" + request.body.orquestrator_base_url);
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
  console.log("Power Strip relay 1 status: " + request.body.power_strip_relay1_status);
  console.log("Power Strip relay 2 status: " + request.body.power_strip_relay2_status);
  console.log("Power Strip relay 3 status: " + request.body.power_strip_relay3_status);
  console.log("Power Strip relay 4 status: " + request.body.power_strip_relay4_status);  
  console.log("Energy limitations: " + request.body.energy_limitations);

  if(request.body.use_situation == "DEEP_SLEEP"){
    io.sockets.emit("deep_sleep");
    return;
  }
  io.sockets.emit("home_connected", true);
  io.sockets.emit("orquestrator_base_url", request.body.orquestrator_base_url);
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
  io.sockets.emit("power_received", request.body.energy_limitations);
  io.sockets.emit(
    "power_received_from_supplier",    
    request.body.energy_limitations,
  );
  io.sockets.emit(
    "alimelo_status_detail",    
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
  io.sockets.emit(
    "power_strip_status", 
    Boolean(strictBoolean(request.body.power_strip_relay1_status)),
    Boolean(strictBoolean(request.body.power_strip_relay2_status)),
    Boolean(strictBoolean(request.body.power_strip_relay3_status)),
    Boolean(strictBoolean(request.body.power_strip_relay4_status)),
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