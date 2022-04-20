const express = require('express')
const cors = require('cors');
const fs = require('fs');
const nodemailer = require('nodemailer');
const app = express()
const port = 8000
let json = {}
const path = './boxesip.json';
const bodyParser = require('body-parser')

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
        console.log(json)
        return true
    }
    else{
        console.log('boxesip.json not exist launch server_box.js before')
        return false
    }
}

app.get('/boxes_ip/:box_name', (req, res) => {
    const name_box  = req.params[Object.keys(req.params)[0]]
    if (FileExist())
        res.send(JSON.stringify(json[name_box]))
  })

app.get('/email', (req, res) => {
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    res.status(201).json("email envoyé")
  })

app.post('/boxes_ip', (req, res) => {
    const dict = {box_name:req.body.name, rpi_box:req.body.ip};
    const dictstring = JSON.stringify(dict)
    fs.writeFile(("boxesip.json"), dictstring, () => {})
    res.status(201).json(dict)
})
app.post('/notify_wifi', (req, res) => {
    const dict = {box_name:req.body.name, rpi_box:req.body.ip};
    const dictstring = JSON.stringify(dict)
    console.log('wifi is activated on '+dictstring)
    res.status(201).json(dict)
})
app.listen(port, () => {
    console.log(`Server cloud listening on port ${port}`)
})