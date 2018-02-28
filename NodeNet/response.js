const fs = require('fs')
const {log} = require('./utils')

class Response {
    constructor() {
    
    }
    
    static template(name) {
        const path = 'templates/' + name
        const options = {
            encoding: 'utf8'
        }
        
        const content = fs.readFileSync(path, options)
        return content
    }
    
    render(file, data) {
        const header = 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n'
        let body = Response.template('index.html')
        log('data', data)
        for(let key in data) {
            body = body.replace(`{{${key}}}`, data[key])
        }
        const r = header + '\r\n' + body
        log('r', r, typeof(r))
        return r
    }
}

module.exports = Response