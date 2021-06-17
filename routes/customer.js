const express = require('express')
const router = express.Router()
const _ = require('lodash')
const bcrypt = require('bcrypt')
const Joi = require('joi')
const Customer = require('../models/customer')

router.post('/', async(req, res) => {

    const { error } = validateUser(req.body)
    if (error) { return res.status(400).send(error.details[0].message); }
    let validUser = await Customer.findOne({ email: req.body.email })
    if (validUser) return res.status(400).send("user already exited");
    const salt = await bcrypt.genSalt(10)
    req.body.password = await bcrypt.hash(req.body.password, salt)
    const user = new Customer(_.pick(req.body, ['name', 'email', 'age', 'password']))
    try {
        const result = await user.save()
        res.status(200).send(_.pick(result, ['_id', 'name', 'email', 'bankBalance']));
    } catch (err) {
        res.send(err.message)
    }
})

function validateUser(customer) {
    const schema = {
        name: Joi.string().min(5).max(255).required(),
        email: Joi.string().min(5).max(255).required().email(),
        age: Joi.number().integer().min(18).max(150).required(),
        password: Joi.string().min(5).max(255).required()
    }
    return Joi.validate(customer, schema)
}

module.exports = router