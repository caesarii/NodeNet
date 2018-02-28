const net = require('net')
const fs = require('fs')

const {log, } = require('./utils')
const Request = require('./request')
const routeMapper = require('./routes')

const error = (code=404) => {
    const e = {
        404: 'HTTP/1.1 404 NOT FOUND\r\n\r\n<h1>NOT FOUND</h1>'
    }
    
    const r = e[code] || ''
    return r
}

const responseFor = (raw) => {
    const request = new Request(raw)
    request.init()
    
    // 定义 route
    const route = {}
    const routes = Object.assign(route, routeMapper)
    // 获取响应函数
    const response = routes[request.path] || error
    // 生成响应
    return response(request)
}

const run = (host = '', port = 3000) => {
    // 创建服务器
    const server = new net.Server()
    
    // 开启服务器监听连接
    server.listen(port, host, () => {
        console.log('listening on server: ', server.address())
    })
    
    server.on('connection', (socket) => {
        // 接收数据
        socket.on('data', (data) => {
            // buffer 类型转成字符串
            const raw = data.toString('utf8')
            
            // response
            const response = responseFor(raw)
            
            // 发送数据
            socket.write(response)
            
            socket.destroy()
        })
    })
    
    // 服务器出错
    server.on('error', (error) => {
        log('server error', error)
    })
    
    // 服务器关闭
    server.on('close', () => {
        log('server closed')
    })
}

const __main = () => {
    run('0.0.0.0', 4000)
}

__main()
