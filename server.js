require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
var app = express()

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('Connected to database'))


const port = 3000
app.listen(port, () => console.log(`Server running on port ${port}`))