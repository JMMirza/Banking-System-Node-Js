const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Customer = require('../models/customer')
const bcrypt = require('bcrypt')
const Joi = require('joi')

router.put('/', auth, async(req, res) => {
    const user = await Customer.findById(req.user._id)
    const { error } = validatePass(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    const previousPassword = await bcrypt.compare(req.body.password, user.password)
    if (!previousPassword) {
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(req.body.password, salt)

    } else {
        return res.status(400).send("you are not allowed to use previous passwords")
    }
    await user.save();
    const token = user.generateAuthToken()
    res.header('x-auth-token', token).status(200).send("Successfully updated the password")
})

function validatePass(user) {
    const schema = {
        password: Joi.string().min(5).max(255).required()
    }
    return Joi.validate(user, schema)
}
module.exports = router