const fs = require('fs')
const path = require('path')
const dns2 = require('dns2')
const { port } = require('./vars')
const { TCPClient, Packet } = require('dns2')
const { spawn } = require('child_process')

const server = dns2.createServer({
    udp: true,
    tcp: true,
    doh: {
        ssl: true,
        cert: fs.readFileSync(path.join(__dirname, '../../server-cert.pem')),
        key: fs.readFileSync(path.join(__dirname, '../../server-key.pem'))
    },
    handle: async (req, send, client) => {
        const response = Packet.createResponseFromRequest(req)
        const [ question ] = req.questions
        const { name } = question

        let tlds = fs.readFileSync(path.join(__dirname, "../../icann_domains.txt")).toString()
        tlds = tlds.split("\n").slice(1)
    
        if (tlds.indexOf(name.split('.').pop().split('/')[0].toUpperCase()) >= 0) {
            const resolve = TCPClient({ dns: '1.1.1.1' })
            const result = await resolve(response.questions[0].name)
            response.answers = result.answers;
        } else {
            const child = spawn('/root/hsd/bin/hsd-cli', ['rpc', 'getnameresource', name.replace('.hitronhub.home', '').split('.').pop(), '--api-key=menace'])
            child.stdout.on('data', async (data) => {
                if (data.toString()[0] != 'I') {
                    let json = JSON.parse(data.toString())
                    if (typeof json == 'object' && json != null) {
                        if (typeof json.records == 'object') {
                            console.log(json.records[0])
                            let resolveHS = TCPClient({
                                dns: json.records[0].address
                            })
                            let result = await resolveHS(response.questions[0].name)
                            response.answers = result.answers
                        }
                    }
                }
            })
        }
        send(response)
    }
})

module.exports = server



