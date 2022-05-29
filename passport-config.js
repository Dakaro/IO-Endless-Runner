const LocalStrategy = require('passport-local')
const User = require('./models/user.js')

function initialize(passport){    
    passport.use(new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
        User.findOne({username: username, password: password})
            .then(user => {
                if(!user) return done(null, false, {message: 'No user with that username and password'})
                return done(null, user)
            })
    }))
    passport.serializeUser((user, done) => done(null, user.username))
    passport.deserializeUser((username, done) => {
        User.findOne({username: username}, (err, user) => {
            done(err, user)
        })
    })
}

module.exports = initialize