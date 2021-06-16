const express = require('express')
const app = express()
const user = require('./routes/users')
const home = require('./routes/home')
const auth = require('./routes/auth')
const add = require('./routes/addAmount')
const config = require('config')

if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1)
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', home)
app.use('/api/users', user)
app.use('/api/auth', auth)
app.use('/api/me', add)

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})