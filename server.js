const net = require('net')
const fs = require('fs')
const {log, } = require('./utils')
const Request = require('./request')


// 注册处理函数
const routeIndex = () => {
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n'
    const body = '<h1>Hello World</h1><img src="image.png>"'
    const r = header + '\r\n' + body
    return r
}

const routeHello = () => {
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=utf8\r\n'
    const body = '<head></head><body><h3>这是对应 /hello 路由的body </h3></body>'
    const r = header + '\r\n' + body
    return r
}

const routeImage = () => {
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: image/png\r\n\r\n'
    // 加载图片
    const file = 'image.png'
    const body = fs.readFileSync(file)
    // 拼接 buffer
    const h = Buffer.from(header)
    const r = Buffer.concat([h, body])
    return r
}

const error = (code=404) => {
    const e = {
        404: 'HTTP/1.1 404 NOT FOUND\r\n\r\n<h1>NOT FOUND</h1>'
    }
    
    const r = e[code] || ''
    return r
}

const responseForPath = (path) => {
    const r = {
        '/': routeIndex,
        '/image': routeImage,
        '/hello': routeHello,
    }
    
    const router = r[path] || error
    const response = router()
    return response
    
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
            const request = data.toString()
            const ip = socket.localAddress
            log(`ip an request: ip 的值： ${ip}\n request 的内容 \n${request}`)
            
            // 解析请求
            const method = request.split(' ')[0]
            const path = request.split(' ')[1]
            // 生成响应
            
            // response
            const response = responseForPath(path)
            
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
