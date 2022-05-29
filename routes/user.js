const express = require('express')
const router = express.Router()
const authCheck = require('../authCheck')

router.get('/', authCheck.checkAuthenticated, async (req, res) => {
    res.render(`user/user`, {user: req.user})
})

module.exports = router