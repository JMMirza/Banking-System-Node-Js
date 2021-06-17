const express = require('express')
const router = express.Router()
const _ = require('lodash')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('config')
const { User, validate } = require('../models/user')

router.get('/', async(req, res) => {
    const result = await User.find().sort('name')
    res.status(200).send(result)
})

router.post('/', async(req, res) => {
    const { error } = validate(req.body)
    if (error) { return res.status(400).send(error.details[0].message); }
    let validUser = await User.findOne({ email: req.body.email })
    if (validUser) return res.status(400).send("user already exited");
    const salt = await bcrypt.genSalt(10)
    req.body.password = await bcrypt.hash(req.body.password, salt)
    const user = new User(_.pick(req.body, ['name', 'email', 'password', 'isAdmin']))
    try {
        const result = await user.save()
        res.status(200).send(_.pick(result, ['_id', 'name', 'email', 'isAdmin']));
    } catch (err) {
        res.send(err.message)
    }
})

router.post('/me', async(req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message);
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(404).send("invalid user");
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).send("invalid password");
    const printUser = await User.findOne({ email: req.body.email }).select('-password -isAdmin')
    const token = user.generateAuthToken()
    res.header('x-auth-token', token).send(printUser)
})


module.exports = router