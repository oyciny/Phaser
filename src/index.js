const server = require('./config/server')
const fetchICANN = require('./utils/fetchICANN')
const { TCPClient, Packet } = require('dns2')
const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')

server.on("listening", () => {
    console.log("Phaser is listening")
    fetchICANN(() => {
        console.log("TLD List Updated")
    })
})

server.on('request', async (req, send, client) => {
    console.log(req.header.id, req.questions[0])

    const response = Packet.createResponseFromRequest(req)
    const [ question ] = req.questions
    const { name } = question

    let tlds = fs.readFileSync(path.join(__dirname, "../icann_domains.txt")).toString()
    tlds = tlds.split("\n").slice(1)

    if (tlds.indexOf(name.split('.')[1].toUpperCase()) > -1) {
        const resolve = TCPClient({ dns: '1.1.1.1' })
        const result = await resolve(name)
        response.answers = result.answers;
    } else {
        const handshake = name.slice(0, -1)
        console.log(handshake)
        const child = spawn('/root/hsd/bin/hsd-cli', ['rpc', 'getnameresource', handshake])
        console.log(child)
    }

    send(response)
})

server.on('close', () => {
    console.log("Phaser closed")
})

server.listen({
    doh: 443,
    udp: 53,
    tcp: 54
})