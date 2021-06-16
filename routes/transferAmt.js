const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user_model')
const Joi = require('joi')

router.post('/', auth, async(req, res) => {
    const user = await User.findById(req.user._id)
    const { error } = validateOtherUser(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    const otherUser = await User.findOne({ email: req.body.email })
    if (!otherUser) return res.status(400).send("User not found")
    if (user.bankBalance > parseInt(req.body.amount)) {
        user.bankBalance -= parseInt(req.body.amount)
        otherUser.bankBalance += parseInt(req.body.amount)
    } else {
        return res.status(400).send("limit exeeds")
    }
    await user.save()
    await otherUser.save()
    const printUser = await User.findById(req.user._id).select('-password -age')
    res.status(200).send(printUser)
})

function validateOtherUser(user) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        amount: Joi.number().integer().required()
    }
    return Joi.validate(user, schema)
}

module.exports = router