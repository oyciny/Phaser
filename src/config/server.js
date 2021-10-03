const fs = require('fs')
const path = require('path')
const dns2 = require('dns2')
const { port } = require('./vars')

const server = dns2.createServer({
    udp: true,
    doh: {
        ssl: true,
        cert: fs.readFileSync(path.join(__dirname, '../../server-cert.pem')),
        key: fs.readFileSync(path.join(__dirname, '../../server-key.pem'))
    }
})

module.exports = server



