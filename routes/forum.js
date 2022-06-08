const express = require('express')
const server = express()
const router = express.Router()
const utils = require('../utils')
const Post = require('../models/post.js')
const User = require("../models/user")

<<<<<<< HEAD
router.get('/', authCheck.checkAuthenticated, async (req, res) => {
=======

router.get('/', utils.checkAuthenticated, async (req, res) => {
>>>>>>> fa60aa09bbe4a953bf11b2df38d01c3a595e5858
    try {
        const posts = await Post.find({}).sort({date: -1})
        res.render('forum/forum', {
            posts: posts,
            user: req.user
        })
    } catch {
        res.redirect('/')
    }
})

//create post route 
router.post('/', utils.checkAuthenticated, async (req, res) => {
    let post = new Post({
        title: req.body.title,
        content: req.body.content,
        author: req.user,
        authorUsername: req.user.username
})
try {
    post = await post.save()
    res.redirect('/forum')
} catch {
    res.render('forum/forum')
}
})
 

module.exports = router