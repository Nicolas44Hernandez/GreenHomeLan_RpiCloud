//box : 192.168.1.31
const local = require('./local.js');
const express = require("express");
const {createServer} = require("http");
const {Server} = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const port = 5000

const io_client = require("socket.io-client");
const socket_client = io_client("http://"+local.adr_camera+":"+port);

httpServer.listen(port);

io.on("connection", (socket) => {
    console.log('Id du client cloud qui se connecte : ' + socket.id);
  });

// Le client cloud affiche son Id qd connecté au serveur box
socket_client.on("connect", () => {
  console.log('Mon Id à ma connection : ' + socket_client.id);
});

// Le client cloud reçoit des messages du serveur box
socket_client.on("image", (msg) => {
  console.log('Emiting image');
  io.emit('image',msg);
});
