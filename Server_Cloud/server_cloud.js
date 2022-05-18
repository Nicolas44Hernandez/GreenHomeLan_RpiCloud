const express = require('express')
const cors = require('cors');
const fs = require('fs');
const axios = require('axios');
const {createServer} = require("http");
const nodemailer = require('nodemailer');
const app = express()
const port = 8000
let json = {}
const path = './boxesip.json';
const bodyParser = require('body-parser')
const {Server} = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer);
let ip_box;
httpServer.listen(port);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/www'));

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ghomelan@gmail.com',
      pass: 'greenhomelanorange'
    }
  });
  
let mailOptions = {
    from: 'ghomelan@gmail.com',
    to: 'ghomelan@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
  };

function FileExist(){
    if (fs.existsSync(path)) {
        json = require(path);
        console.log('The File boxeip.json exist with this information : ' + JSON.stringify(json))
        return true
    }
    else{
        console.log('boxesip.json not exist launch server_box.js before');
        return false
    }
}

app.get('/boxes_ip/:box_name', (req, res) => {
  const name_box  = req.params[Object.keys(req.params)[0]];
  if (FileExist()){
    console.log('---> Receive POST /boxes_ip/rpi_box from Client Web to know ip box : ' + name_box);
    res.send(JSON.stringify(json[name_box]));
    console.log("<--- Response to POST /boxes_ip/rpi_box to Client web by indicate ip box : " + JSON.stringify(json[name_box]));
    console.log(` `);
  }      
})

app.get('/email', (req, res) => {
  console.log('---> Receive GET /email from Box send an email');
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);  
    } else {
      console.log("<--- Response to GET /email to Box indicate Email sent");
      console.log('Email sent: ' + info.response);
      io.sockets.emit("buttonBle", "bouttonBLE");
    }
  });
  res.status(201).json("email envoyé");
})

app.post('/boxes_ip', (req, res) => {
  ip_box = req.body.ip;
  console.log('---> Receive POST /boxes_ip from box');
  const dict = {box_name:req.body.name, rpi_box:req.body.ip};
  const dictstring = JSON.stringify(dict);
  fs.writeFile(("boxesip.json"), dictstring, () => {});
  res.status(201).json(dict);
  console.log("<---- Response to to POST /boxes_ip : " + JSON.stringify(dict));
});

app.post('/notify_wifi', (req, res) => {
  const dict = {status:req.body.status};
  console.log('---> Receive POST /notify_wifi from box on the wifi status : ' + JSON.stringify(dict));
  res.status(201).json(dict);
  console.log("<---- Response to POST /notify_wifi : OK");
  io.sockets.emit("data", "launch retreive");
  console.log("----> Emit on socket Client : launch retrieve");
  console.log(` `);
}); 

io.on("connection", (socket) => {
  console.log('Connection socket on client web with id : ' + socket.id); 
  socket.emit('test', 'test' + socket.id);
  socket.on("disconnect", (reason) => { 
    console.log('Disconnection socket on client web with id : ' + socket.id); 
    let boxesip = fs.readFileSync('boxesip.json');
    let jsonip = JSON.parse(boxesip); 
    let ip_box = jsonip["rpi_box"];
    let url = 'http://' + ip_box + ":8008/disconnect";
    console.log("---> Send GET /disconnect to shut down homelan wifi");
    axios.get(url)  
      .then((res) => {
        console.log("<--- Receive GET /disconnect by box : " + res.data); 
      })
      .catch(function (error) {
        console.log(error);
      }); 
  });
});

  
 
/*
app.listen(port, () => {
    console.log(`Server cloud listening on port ${port}`)
})*/