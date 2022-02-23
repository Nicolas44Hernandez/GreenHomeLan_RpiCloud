// Internal
const Utils = require('./utils.js');
const log = Utils.log;

// External
const bodyParser = require('body-parser');
const express = require('express');
const {createServer} = require("http");
const {Server} = require("socket.io");
let a = 0
// Const
const port = 5000;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

class ServerData {
    constructor() {
        let this_ = this;
        this_.last_frame = undefined;
    }
   
    frame_data(req, res) {
        let this_ = this;
        let frame_data = req.body.data;
        log("Got frame data 1: " + frame_data.length + " bytes");
        io.emit('image',frame_data);
        this_.last_frame = frame_data;
        res.end()
    }
}

// Instanciate Server
const server = new ServerData();

// Requests
app.use(bodyParser.urlencoded({
    limit: '200mb',
    extended: true
}))
app.post("/frame_data", function(req, res) {
    server.frame_data(req, res);
});
io.on("connection", (socket) => {
    console.log('Id du client web :' + socket.id);
  });
 
httpServer.listen(port);
