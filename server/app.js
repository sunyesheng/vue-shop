const express = require('express')
const app = express()
app.use(express.static('./dist'))
app.listen(8077, () => {
  console.log('http://127.0.0.1')
})
