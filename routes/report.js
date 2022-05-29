const express = require('express')
const router = express.Router()
const authCheck = require('../authCheck')

router.get('/', authCheck.checkAuthenticated, (req, res) => {
    res.render('report/report', {user: req.user})
})

module.exports = router