const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title: {
        type: String
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

    authorUsername: {
        type: String,
        required: true
    },

    date:{
        type: Date,
        required: true,
        default: Date.now
    }
})


module.exports = mongoose.model('Post', postSchema)