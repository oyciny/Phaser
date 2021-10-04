const { TCPClient, Packet } = require('dns2')

let request = async (req) => {
    const response = Packet.createResponseFromRequest(req)
    const [ question ] = req.question
    const { name } = question
    const resolve = TCPClient({ dns: '1.1.1.1' })
    const result = await resolve(name)
    response.answers.push({
        name,
        type: Packet.TYPE.A,
        class: Packet.CLASS.IN,
        ttl: 300,
        address: result.answers[0].address
    })
    return response
}

module.exports = request