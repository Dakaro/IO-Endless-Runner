const express = require('express')
const router = express.Router()
const authCheck = require('../authCheck')
const Post = require('../models/post.js')
const User = require("../models/user")


router.get('/', authCheck.checkAuthenticated, async (req, res) => {
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
router.post('/', authCheck.checkAuthenticated, async (req, res) => {
    let post = new Post({
        title: req.body.title,
        content: req.body.content,
        author: req.user
})
try {
    post = await post.save()
    res.redirect('/forum')
} catch {
    res.render('forum/forum')
}
})
 

module.exports = router