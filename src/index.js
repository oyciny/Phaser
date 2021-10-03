const server = require('./config/server')
const { Packet } = require('dns2')

server.on('request', (req, send, client) => {
    console.log(req.header.id, req.questions[0])
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

(async () => {
    const closed = new Promise(resolve => process.on("SIGINT", resolve))
    await server.listen({
        doh: 443,
        udp: 53
    })
    console.log("Listening for requests")
    console.log(server.addresses())
    await closed
    process.stdout.write('\n')
    await server.close()
    console.log("Server closed")
})