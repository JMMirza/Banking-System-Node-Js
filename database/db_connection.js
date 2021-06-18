const mongoose = require('mongoose')

function createDB() {

    mongoose.connect("mongodb://localhost/banking-system", {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        .then(() => {
            console.log('connection established')
        })
        .catch(err => console.error('failed', err))

}

module.exports = { createDB }