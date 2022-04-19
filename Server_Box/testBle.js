const express = require('express')
const app = express()
const port = 3000
const noble = require('noble');

 
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


noble.startScanning(); // any service UUID, no duplicates

async function main () {
}  
 

main() 
/*  .then(console.log)
  .catch(console.error)*/