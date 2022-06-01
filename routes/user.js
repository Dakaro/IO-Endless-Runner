const express = require('express')
const router = express.Router()
const authCheck = require('../authCheck')
const User = require('../models/user')

router.get('/', authCheck.checkAuthenticated, async (req, res) => {
    res.render(`user/user`, { user: req.user, userToDisplay: null })
})

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        res.render('user/user', {
            userToDisplay: user,
            user: req.user
        })
    } catch {
        res.redirect('/')
    }
})

module.exports = router