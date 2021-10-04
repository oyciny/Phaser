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
    console.log(`ID: ${req.header.id} | Name: ${req.questions[0].name}`)

    const response = Packet.createResponseFromRequest(req)
    const [ question ] = req.questions
    const { name } = question

    let tlds = fs.readFileSync(path.join(__dirname, "../icann_domains.txt")).toString()
    tlds = tlds.split("\n").slice(1)
    
    if (tlds.indexOf(name.split('.').pop().split('/')[0].toUpperCase()) >= 0) {
        const resolve = TCPClient({ dns: '1.1.1.1' })
        const result = await resolve(response.questions[0].name)
        response.answers = result.answers;
    } else {
        const handshake = name.slice(0, -1)
        const child = spawn('/root/hsd/bin/hsd-cli', ['rpc', 'getnameresource', handshake])
        child.stdout.on('data', async (data) => {
            if (data.toString()[0] != 'I') {
                let json = JSON.parse(data.toString())
                console.log(json.records[0].address)
                /*
                if (typeof json == 'object' && json != null) {
                    if (typeof json.records == 'object') {
                        let resolveHS = TCPClient({
                            dns: json.records[0].address
                        })
                        let result = await resolveHS(response.questions[0].name)
                        response.answers = result.answers
                    }
                }
                */
            }
        })
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