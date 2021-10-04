const https = require('https')
const fs = require('fs')
const path = require('path')

function fetchICANN(callback) {
    const url = "https://data.iana.org/TLD/tlds-alpha-by-domain.txt"
    const file = fs.createWriteStream(path.join(__dirname, "../../icann_domains.txt"))
    https.get(url, (res) => {
        res.pipe(file)
        file.on('finish', () => {
            file.close(callback)
        })
    })
}

module.exports = fetchICANN