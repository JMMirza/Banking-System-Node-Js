require('express-async-errors')
const winston = require('winston')
const express = require('express')
const app = express()
const customer = require('./routes/customer')
const home = require('./routes/home')
const auth = require('./routes/auth')
const add = require('./routes/addAmount')
const transfer = require('./routes/transferAmt')
const pass = require('./routes/forgetPass')
const user = require('./routes/user')
const bank = require('./routes/bank')
const error = require('./middleware/error')
const config = require('config')
const DbConnect = require('./database/db_connection')
DbConnect.createDB()

winston.add(winston.transports.File, { filename: 'logfile.log' })
process.on('uncaughtException', (ex) => {
    winston.error(ex.message, err)
    process.exit(1)
})

process.on('unhandledRejection', (ex) => {
    winston.error(ex.message, err)
    process.exit(1)
})

if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1)
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', home)
app.use('/api/user', user)
app.use('/api/customer', customer)
app.use('/api/auth', auth)
app.use('/api/me/add', add)
app.use('/api/me/send', transfer)
app.use('/api/me/pass', pass)
app.use('/api/bank', bank)

app.use(error)

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})