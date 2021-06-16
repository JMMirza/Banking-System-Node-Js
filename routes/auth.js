const express = require('express')
const router = express.Router()
const _ = require('lodash')
const bcrypt = require('bcrypt')
const Joi = require('joi')
const User = require('../models/user_model')

router.post('/', async(req, res) => {
    const { error } = validate(req.body)
    if (error) { return res.status(400).send(error.details[0].message); }
    const user = await User.findOne({ email: req.body.email })
    if (!user) return "invalid user";
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).send("invalid password");
    const token = user.generateAuthToken()
    res.header('x-auth-token', token).send(user)
})

function validate(user) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    }
    return Joi.validate(user, schema)
}

module.exports = router