require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const expresLayouts = require('express-ejs-layouts')

const indexRouter = require('./routes/index.js')
const userRouter = require('./routes/user.js')
const reportRouter = require('./routes/report.js')

const app = express()


app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expresLayouts)
app.use(express.static('public'))

app.use('/', indexRouter)
app.use('/user', userRouter)
app.use('/report', reportRouter)

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('Connected to database'))


const port = 3000
app.listen(process.env.PORT || port, () => console.log(`Server running on port ${port}`))