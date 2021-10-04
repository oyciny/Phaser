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
})

server.on('close', () => {
    console.log("Phaser closed")
})

server.listen({
    doh: 443,
    udp: 53,
    tcp: 54
})