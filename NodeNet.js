const net = require('net')
const Request = require('./request')
const Response = require('./response')
const {log, error, } = require('./utils')


class NodeNet {
    constructor() {
        this.routeMapper = {}
    }
    
    use(path, router) {
        this.routeMapper[path] = router
    }
    
    listen(host, port) {
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
                const response = this.responseFor(raw)
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
    
    responseFor(raw) {
        const request = new Request(raw)
        const response = new Response()
        request.init()
        
        // 定义 route
        const route = {}
        const routes = Object.assign(route, this.routeMapper)
        // 获取响应函数
        const router = routes[request.path] || error
        // 生成响应
        return router(request, response)
    }
}

module.exports = NodeNet