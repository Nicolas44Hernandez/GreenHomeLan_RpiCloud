const bodyParser = require('body-parser');
const express = require('express');
const {createServer} = require("http");
const {Server} = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const port = 4000;

httpServer.listen(port);

app.use(express.static(__dirname + '/www'));
app.use(bodyParser.urlencoded({
    limit: '200mb',
    extended: true
}))

class ServerData {
    constructor() {
        this.last_frame = undefined;
    }
   
    frame_data(req, res) {
        this.last_frame = req.body.data;
        //console.log("Got frame data 1: " + this.last_frame + " bytes");
        res.end()
    }

    get_frame(req, res) {
        if (this.last_frame != undefined) {
            res.end(this.last_frame);
            this.last_frame = undefined;
        }
    }
}

const server = new ServerData();

app.post("/frame_data", function(req, res) {
    
    server.frame_data(req, res);
});

app.get("/get_frame", (req, res) => {
    server.get_frame(req, res);
});