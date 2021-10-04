const fs = require('fs')
const dns2 = require('dns2')
const path = require('path')

const server = dns2.createServer({
    udp: true,
    tcp: true,
    doh: {
        ssl: true,
        cert: fs.readFileSync(path.join(__dirname, '../../server-cert.pem')),
        key: fs.readFileSync(path.join(__dirname, '../../server-key.pem'))
    }
})

module.exports = server



