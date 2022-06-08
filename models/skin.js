const mongoose = require('mongoose')
const { stringify } = require('nodemon/lib/utils')

const skinSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
    
    
})

module.exports = mongoose.model('Skin', skinSchema)