const server = require('./config/server')
const { TCPClient, Packet } = require('dns2')

server.on("listening", () => {
    console.log("Phaser is listening")
})

server.on('request', async (req, send, client) => {
    console.log(req.header.id, req.questions[0])
    const response = Packet.createResponseFromRequest(req)
    const [ question ] = req.questions
    const { name } = question
    const resolve = TCPClient({ dns: '1.1.1.1' })
    const result = await resolve(name)
    console.log(result, "::", result.Packet.answers, "::", result.Packet.answers.address)
    /*
    response.answers.push({
        name,
        type: Packet.TYPE.A,
        class: Packet.CLASS.IN,
        ttl: 300,
        address: result.address
    })
    */
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