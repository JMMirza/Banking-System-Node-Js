const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const config = require('config')

const customerSchema = new mongoose.Schema({
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
        unique: true,
        lowercase: true
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
        default: 0
    }
})
customerSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id }, config.get('jwtPrivateKey'), { expiresIn: "300s" })
    return token
}
const Customer = mongoose.model('Customer', customerSchema)

module.exports = Customer