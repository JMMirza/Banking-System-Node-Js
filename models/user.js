const mongoose = require('mongoose')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const config = require('config')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
        required: true
    }

})
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'), { expiresIn: "300s" })
    return token
}
const User = mongoose.model('User', userSchema)


function validateUser(user) {
    const schema = {
        name: Joi.string().min(5).max(255),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
        isAdmin: Joi.boolean()
    }
    return Joi.validate(user, schema)
}

exports.userSchema = userSchema
exports.User = User
exports.validate = validateUser