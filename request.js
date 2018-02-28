// Request: 保存请求相关的信息
const {log} = require('./utils')
// 解析 path
const parsedPath = (path) => {
    // 是否包含 query
    const index = path.indexOf('?')
    if(index === -1) {
        // query 为空
        return {
            path: path,
            query: {},
        }
    } else {
        // 解析 path query
        const l = path.split('?')
        path = l[0]
        const search = l[1]
        const args = search.split('&')
        const query = {}
        for(let arg of args) {
            const [k, v] = arg.split('=')
            query[k] = v
        }
        return {
            path: path,
            query: query
        }
    }
}

class Request {
    constructor(raw) {
        this.raw = raw
        this.method = 'GET'
        this.path = ''
        this.query = {}
        this.headers = {}
        this.body = ''
    }
    
    init() {
        // log('raw', this.raw)
        // 解析原始请求信息
        const raw = this.raw
        const raws = raw.split(' ')
        // method
        this.method = raws[0]
        // path
        let pathname = raws[1]
        let {path, query} = parsedPath(pathname)
        this.path = path
        this.query = query
        // body
        this.body = raw.split('\r\n\r\n')[1]
        // head
        const head = raw.split('\r\n\r\n')[0]
        const allHeaders = head.split('\r\n').slice(1)
        allHeaders.forEach(header => {
            const [name, val] = header.split(':')
            this.headers[name] = val
        })
    }
    
    // 解析 request body
    form() {
        const body = decodeURIComponent(this.body)
        const pairs = body.split('&')
        const d = {}
        for(let pair of pairs) {
            const [k, v] = pair.split('=')
            d[k] = v
        }
        return d
    }
}

module.exports = Request