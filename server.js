require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const expresLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const User = require('./models/user.js')
const Post = require('./models/post')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
//const socket = require("socket.io");
const bcrypt = require('bcrypt')

const indexRouter = require('./routes/index.js')
const userRouter = require('./routes/user.js')
const reportRouter = require('./routes/report.js')
const authRouter = require('./routes/auth.js')
const passport = require('passport')
const forumRouter = require('./routes/forum.js')
const rankingRouter = require('./routes/ranking')
const catalogRouter = require('./routes/catalog')
const shopRouter = require('./routes/shop')
const gameRouter = require('./routes/game')

const app = express()

const initializePassport = require('./passport-config')
initializePassport(passport)

app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expresLayouts)
app.use(express.static('public'))
//app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use(express.static('public/scripts'))

// No caching so that sensitive information is not accessible by pressing the
// back button after logout
app.use(function (req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});

app.use('/', indexRouter)
app.use('/user', userRouter)
app.use('/report', reportRouter)
app.use('/auth', authRouter)
app.use('/forum', forumRouter)
app.use('/ranking', rankingRouter)
app.use('/catalog', catalogRouter)
app.use('/shop', shopRouter)
app.use('/game', gameRouter)

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('Connected to database'))


const port = 3000

const server = app.listen(process.env.PORT || port, () => console.log(`Server running on port ${port}`))


module.exports = app