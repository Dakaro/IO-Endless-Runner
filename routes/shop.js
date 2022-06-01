const express = require('express')
const router = express.Router()
const authCheck = require('../authCheck')
const User = require('../models/user')
const prices = require('../public/avis/prices')

router.get('/', authCheck.checkAuthenticated, async (req, res) => {
    res.render('shop/shop', { user: req.user, prices: prices})
})

module.exports = router