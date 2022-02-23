
const express = require("express");
const {createServer} = require("http");
const {Server} = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const port = 4000;
httpServer.listen(port);

const io_client = require("socket.io-client");
const socket_client = io_client("http://127.0.0.1:5000");

class ServerData {
  constructor() {
      let this_ = this;
      this_.client_res = undefined;
      this_.last_frame = undefined;
  }

  get_frame(req, res) {
      let this_ = this;
      if (this_.last_frame != undefined) {// If data is available give it now
          res.end(this_.last_frame);
          this_.last_frame = undefined;
      } else {                            // Else just keep in memory the response object
          this_.client_res = res;
      }
  }

  update_frame(msg){
    let this_ = this;
    this_.last_frame = msg
  }
}

app.use(express.static(__dirname + '/www'));

// Instanciate Server
const server = new ServerData();

// Le serveur cloud écoute qui se connecte 
io.on("connection", (socket) => {
  console.log('Id du client web :' + socket.id);
});

// Le client cloud affiche son Id qd connecté au serveur box
socket_client.on("connect", () => {
  console.log('Mon Id à ma connection : ' + socket_client.id);
});

// Le client cloud reçoit des messages du serveur box
socket_client.on("image", (msg) => {
  server.update_frame(msg);
});

app.get("/get_frame", (req, res) => {
  server.get_frame(req, res);
});
