const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Customer = require('../models/customer')
const Joi = require('joi')

router.put('/', auth, async(req, res) => {
    const user = await Customer.findById(req.user._id)
    const { error } = validateAmount(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    user.bankBalance += parseInt(req.body.amount)
    await user.save()
    const printUser = await Customer.findById(req.user._id).select('-password -age')
    res.status(200).send(printUser)
})

function validateAmount(amount) {
    const schema = {
        amount: Joi.number().integer().min(10).max(25000).required()
    }
    return Joi.validate(amount, schema)
}

module.exports = router