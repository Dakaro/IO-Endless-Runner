const express = require('express')
const server = express()
const router = express.Router()
const utils = require('../utils')
const Post = require('../models/post.js')
const User = require("../models/user")

router.get('/', utils.checkAuthenticated, async (req, res) => {
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

router.get('/rules', utils.checkAuthenticated, async (req, res) => {
    res.render('forum/rules', {
        user: req.user
    })
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