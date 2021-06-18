const express = require('express')
const router = express.Router()
const { User } = require('../models/user')
const auth = require('../middleware/auth')
const { Bank, validate } = require('../models/bank')

router.get('/', async(req, res, next) => {
    const result = await Bank.find().sort('name')
    res.status(200).send(result)
})

router.post('/', auth, async(req, res) => {
    const user = await User.findById(req.user._id)
    if (!user && req.user.isAdmin === false) return res.status(403).send("invalid user")
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    const validBank = await Bank.findOne({ name: req.body.name })
    if (validBank) return res.status(400).send('bank already exists')
    const bank = new Bank({
        name: req.body.name,
        user: {
            _id: req.user._id,
            name: user.name
        },
        code: req.body.code
    })
    await bank.save()
    res.status(200).send(bank)
})
router.put('/:id', auth, async(req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const user = await User.findById(req.user._id)
    if (!user && req.user.isAdmin === false) return res.status(403).send("invalid user")
    const bank = await Bank.findOneAndUpdate(req.params.id, {
        name: req.body.name,
        user: {
            _id: user._id,
            name: user.name
        },
        code: req.body.code,
    }, { new: true });

    if (!bank) return res.status(404).send('The bank with the given ID was not found.');

    res.send(bank);
});

router.delete('/:id', auth, async(req, res) => {
    const user = await User.findById(req.user._id)
    if (!user && req.user.isAdmin === false) return res.status(403).send("invalid user")

    const bank = await Bank.findOneAndDelete(req.params.id);

    if (!bank) return res.status(404).send('The bank with the given ID was not found.');

    res.send(bank);
});


module.exports = router