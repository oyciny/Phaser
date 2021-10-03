const server = require('./config/server')
const { port } = require('./config/vars')

server.on('listening', () => {
    console.log('Phaser server listening')
})

server.on('request', (req, res, rinfo) => {
    console.log(req.header.id, req.questions[0])
})

server.on('close', () => {
    console.log('Phaser stopped')
})

server.listen(port)