const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user_model')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const Joi = require('joi')
const { result } = require('lodash')

router.post('/add', auth, async(req, res) => {
    const user = await User.findById(req.user._id)
    const { error } = validateAmount(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    user.bankBalance += parseInt(req.body.amount)
    await user.save()
    const printUser = await User.findById(req.user._id).select('-password -age')
    res.status(200).send(printUser)
})

router.post('/transfer', auth, async(req, res) => {
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

router.post('/password', auth, async(req, res) => {
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

function validateAmount(user) {
    const schema = {
        amount: Joi.number().integer().required()
    }
    return Joi.validate(user, schema)
}

function validateOtherUser(user) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        amount: Joi.number().integer().required()
    }
    return Joi.validate(user, schema)
}

function validatePass(user) {
    const schema = {
        password: Joi.string().min(5).max(255).required()
    }
    return Joi.validate(user, schema)
}
module.exports = router