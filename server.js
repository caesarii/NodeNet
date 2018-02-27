const net = require('net')

const host = '0.0.0.0'
const port = 2000


// 创建服务器
const server = new net.Server()

// 开启服务器监听连接
server.listen(port, host, () => {
    console.log('listening on server: ', server.address())
})

server.on('connection', (socket) => {
    const address = socket.remoteAddress
    const port = socket.remotePort
    const family = socket.remoteFamily
    console.log('remote client info', address, port, family)

    // 接收数据
    socket.on('data', (data) => {
        // buffer 类型转成字符串
        const r = data.toString()
        console.log('Data request:\r\n', r, typeof(r))

        // response
        const response = 'HTTP/1.1 200 OK\r\nContent-Length: 12\r\n\r\nHello world!'
        // 发送数据
        socket.write(response)
        
        socket.destroy()
    })
})

// 服务器出错
server.on('error', (error) => {
    console.log('server error', error)
})

// 服务器关闭
server.on('close', () => {
    console.log('server closed')
})
