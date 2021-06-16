const mongoose = require('mongoose')

function createDB() {

    mongoose.connect("mongodb://localhost/practice-db", {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        })
        .then(() => {
            console.log('connection established')
        })
        .catch(err => console.error('failed', err))

}

module.exports = { createDB }