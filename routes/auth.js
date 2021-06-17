const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const Joi = require('joi')
const Customer = require('../models/customer')

router.post('/', async(req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message);
    const user = await Customer.findOne({ email: req.body.email })
    if (!user) return res.status(404).send("invalid user");
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).send("invalid password");
    const printUser = await Customer.findOne({ email: req.body.email }).select('-password -age')
    const token = user.generateAuthToken()
    res.header('x-auth-token', token).send(printUser)
})

function validate(user) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    }
    return Joi.validate(user, schema)
}

module.exports = router