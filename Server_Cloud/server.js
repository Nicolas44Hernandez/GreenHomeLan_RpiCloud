const express = require('express')
const app = express()
const port = 8080


app.use(express.static(__dirname + '/www'));

app.listen(port, () => {
  console.log(`Server cloud listening on port ${port}`)
})