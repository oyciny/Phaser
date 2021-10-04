const server = require('./config/server')
const request = require('./helpers/request.handler')

server.on("listening", () => {
    console.log("Phaser is listening")
})

server.on('request', async (req, send, client) => {
    console.log(req.header.id, req.questions[0])
    const response = request(req)
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