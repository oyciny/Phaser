const { TCPClient, Packet } = require('dns2')

function getResponse(request) {
    const response = Packet.createResponseFromRequest(request)
    const [ question ] = req.questions
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

module.exports = {
    getResponse: getResponse
}