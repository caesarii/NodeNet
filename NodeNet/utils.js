
const log = console.log

const error = (code=404) => {
    const e = {
        404: 'HTTP/1.1 404 NOT FOUND\r\n\r\n<h1>NOT FOUND</h1>'
    }
    
    const r = e[code] || ''
    return r
}

module.exports = {
    log,
    error,
}