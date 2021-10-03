const connect = require('connect')
const fs = require('fs')
const { createSecureServer } = require('http2')
const DoH = require('./playdoh')
const app = connect()

const options = {
    key: fs.readFileSync('server-key.pem'),
    cert: fs.readFileSync('server-cert.pem')
}

app.use(DoH)

app.use((req, res, next) => {
    console.log(`${req.protocol}://${req.headers.host}${req.originalUrl}`)
    next()
})

app.use('/*', async (req, res) => {
    console.log('request: ')
    res.end('')
})

const server = createSecureServer(options, app)

module.exports = server



