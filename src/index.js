const server = require('./config/server')
const { Packet } = require('dns2')

server.on('listening', () => {
    console.log('Phaser server listening')
})

server.on('request', (req, send, client) => {
    const response = Packet.createResponseFromRequest(req)
    const [ question ] = req.questions
    const { name } = question
    response.answers.push({
        name,
        type: Packet.TYPE.A,
        class: Packet.CLASS.IN,
        ttl: 300,
        address: '1.1.1.1'
    })
    send(response)
})

server.on('close', () => {
    console.log('Phaser stopped')
})

server.listen()