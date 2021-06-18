const mongoose = require('mongoose')
const Joi = require('joi')
const userSchema = require('./user')

const bankSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    user: {
        type: userSchema,
        required: true
    },
    code: { type: Number, required: true },

})

const Bank = mongoose.model('Bank', bankSchema)

function validateBank(bank) {
    const schema = {
        name: Joi.string().min(5).max(255),
        code: Joi.number().integer()
    }
    return Joi.validate(bank, schema)
}

exports.bankSchema = bankSchema
exports.Bank = Bank
exports.validate = validateBank