const mongoose = require('mongoose')

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

    joinDate: {
        type: Date,
        required: true,
        default: Date.now
    }, 
    
    lastSeen: {
        type: Date,
        required: true,
        default: Date.now
    },
    
    coins: {
        type: Number,
        required: true,
        default: 0
    },
    
    points: {
        type: Number,
        required: true,
        default: 0
    },

    rank: {
        type: Number
    },

    unlockedSkins: {
        type: [Number],
        default: []
    },
    
    equippedSkin: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('User', userSchema)