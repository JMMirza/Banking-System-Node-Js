const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const config = require('config')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    age: Number,
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024,
    },
    bankBalance: {
        type: Number,
        // get: v => Math.round(v),
        // set: v => Math.round(v)
    }
})
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, name: this.name }, config.get('jwtPrivateKey'))
    return token
}
const User = mongoose.model('User', userSchema)

module.exports = User