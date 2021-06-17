const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Customer = require('../models/customer')
const Joi = require('joi')

router.put('/', auth, async(req, res) => {
    const user = await Customer.findById(req.user._id)
    const { error } = validateOtherUser(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    const otherUser = await Customer.findOne({ email: req.body.email })
    if (!otherUser) return res.status(400).send("User not found")
    if (user.email !== otherUser.email) {
        if (user.bankBalance > parseInt(req.body.amount)) {
            user.bankBalance -= parseInt(req.body.amount)
            otherUser.bankBalance += parseInt(req.body.amount)
        } else {
            return res.status(400).send("limit exeeds")
        }
    } else {
        return res.status(403).send("this is not allowed")
    }
    await user.save()
    await otherUser.save()
    const printUser = await Customer.findById(req.user._id).select('-password -age')
    res.status(200).send(printUser)
})

function validateOtherUser(user) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        amount: Joi.number().integer().min(10).max(25000).required()
    }
    return Joi.validate(user, schema)
}

module.exports = router