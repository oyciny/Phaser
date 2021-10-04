const https = require('https')
const fs = require('fs')
const path = require('path')

function fetchICANN() {
    const url = "https://data.iana.org/TLD/tlds-alpha-by-domain.txt"
    https.get(url, (res) => {
        const file = fs.createWriteStream(path.join(__dirname, "../../icann_domains.txt"))
        res.pipe(file)
    })
    console.log("TLD List Updated")
}

module.exports = fetchICANN