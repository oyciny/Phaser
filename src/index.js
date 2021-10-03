const server = require('./config/server')
const { TCPClient, Packet } = require('dns2')

(async () => {
    const closed = new Promise(resolve => process.on("SIGINT", resolve))
    await server.listen({
        doh: 443,
        udp: 53
    })
    console.log("Listening for requests")
    console.log(server.addresses())

    let resolve = TCPClient({ dns: '1.1.1.1' })
    let result = await resolve(res.questions[0].name)

    server.on('request', (req, send, res) => {
        console.log(req.header.id, req.questions[0])
        const response = Packet.createResponseFromRequest(req)
        const [ question ] = req.questions
        const { name } = question
        response.answers.push({
            name,
            type: Packet.TYPE.A,
            class: Packet.CLASS.IN,
            ttl: 300,
            address: result.answers.address
        })
        send(response)
    })

    await closed
    process.stdout.write('\n')
    await server.close()
    console.log("Server closed")
})