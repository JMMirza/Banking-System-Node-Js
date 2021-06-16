const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user_model')
const bcrypt = require('bcrypt')
const Joi = require('joi')

router.post('/', auth, async(req, res) => {
    const user = await User.findById(req.user._id)
    const { error } = validatePass(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    if (user.password !== req.body.password) {
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)
    } else {
        return res.status(400).send("you are not allowed to user previous passwords")
    }
    await user.save()
    const printUser = await User.findById(req.user._id).select({ password: 1 })
    res.status(200).send(printUser)
})

function validatePass(user) {
    const schema = {
        password: Joi.string().min(5).max(255).required()
    }
    return Joi.validate(user, schema)
}
module.exports = router