const DbConnect = require('../database/db_connection')
DbConnect.createDB()
const express = require('express')
const router = express.Router()
const _ = require('lodash')
const bcrypt = require('bcrypt')
const Joi = require('joi')
const User = require('../models/user_model')

router.post('/', async(req, res) => {
    const { error } = validateUser(req.body)
    if (error) { return res.status(400).send(error.details[0].message); }
    let validUser = await User.findOne({ email: req.body.email })
    if (validUser) return res.status(400).send("user already exited");
    const salt = await bcrypt.genSalt(10)
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        age: req.body.age,
        password: await bcrypt.hash(req.body.password, salt),
        bankBalance: 0,

    })
    try {
        const result = await user.save()
        res.status(200).send(_.pick(result, ['_id', 'name', 'email', 'bankBalance']));
    } catch (err) {
        res.send(err)
    }
})

function validateUser(user) {
    const schema = {
        name: Joi.string().min(5).max(255).required(),
        email: Joi.string().min(5).max(255).required().email(),
        age: Joi.number().integer().min(1).max(100).required(),
        password: Joi.string().min(5).max(255).required()
    }
    return Joi.validate(user, schema)
}

module.exports = router