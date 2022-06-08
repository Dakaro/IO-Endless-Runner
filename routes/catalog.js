const express = require('express')
const router = express.Router()
const utils = require('../utils')
const User = require('../models/user')

router.get('/', utils.checkAuthenticated, async (req, res) => {
    let searchOptions = {}
    if(req.query.username != null && req.query.username !== ''){
        //case insensitive regex
        searchOptions.username = new RegExp(req.query.username, 'i')
    }
    
    try {
        const users = await User.find(searchOptions)
        res.render('catalog/catalog', {
            users: users,
            searchOptions: req.query,
            user: req.user
        })
    } catch {
        res.redirect('/')
    }
})

module.exports = router