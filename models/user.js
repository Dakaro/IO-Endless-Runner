const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    
    date:{
        type: Date,
        required: true
    },
    
    content: {
        type: String,
        required: true
    }
})

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    
    password: {
        type: String,
        required: true
    },
    
    coins: {
        type: Number,
        required: true
    },
    
    points: {
        type: Number,
        required: true
    },
    
    posts: {
        type: [postSchema],
        required: true
    }
})

module.exports = mongoose.model('User', userSchema)