const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    
    content: {
        type: String,
        required: true
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },

    date:{
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model('Post', postSchema)