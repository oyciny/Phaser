const { playdoh } = require('playdoh')

const options = {
    protocol: 'udp4',
    localAddress: '',
    resolverAddress: '127.0.0.1',
    resolverPort: '53',
    timeout: 10000
}

const DoH = playdoh(options)

module.exports = DoH