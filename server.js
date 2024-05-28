const express = require('express')
const server = express()
const port = process.env.PORT || 5000
const morgan = require("morgan")
const router = require("./routes/router")
const mongoose = require("mongoose")
const path = require('path')
require('dotenv').config()
const cors = require('cors')

mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB!"))
  .catch(err => console.error("Error connecting to MongoDB:", err))

server.use(cors())
server.use(morgan('dev'))
server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.use('/public', express.static(path.join(__dirname, 'public')));
server.use("/", router)

server.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
