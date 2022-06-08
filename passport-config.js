const LocalStrategy = require('passport-local')
const User = require('./models/user.js')
const bcrypt = require('bcrypt')

function initialize(passport) {
    const authenticateUser = async (username, password, done) => {
        const user = await User.findOne({username: username})
        if(!user) {  
            return done(null, false, {message: 'No user with that username'})
        }
        try{
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, {message: 'Password incorrect'})
            }
        } catch (err) {
            return done(err)
        }
    }

    passport.use(new LocalStrategy({usernameField: 'username'},
    authenticateUser))

    passport.serializeUser((user, done) => done(null, user.username))
    passport.deserializeUser((username, done) => {
        User.findOne({username: username}, (err, user) => {
            done(err, user)
        })
    })
}

module.exports = initialize