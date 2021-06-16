const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user_model')
const Joi = require('joi')

router.put('/', auth, async(req, res) => {
    const user = await User.findById(req.user._id)
    const { error } = validateAmount(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    user.bankBalance += parseInt(req.body.amount)
    await user.save()
    const printUser = await User.findById(req.user._id).select('-password -age')
    res.status(200).send(printUser)
})

function validateAmount(user) {
    const schema = {
        amount: Joi.number().integer().min(10).max(25000).required()
    }
    return Joi.validate(user, schema)
}

module.exports = router