const net = require('net')
const {log, } = require('./utils')
const host = '0.0.0.0'
const port = 2000

// 创建客户端
const client = new net.Socket()

// 客户端连接到服务器
client.connect(port, host, () => {
    console.log("socket address", client.address())
    console.log("local address", client.localAddress, client.localPort)
    console.log("remote address", client.remoteAddress, client.remotePort)
    // 向服务器发送一个消息
    const request = 'GET / HTTP/1.1\r\nHost: ${url}\r\n\r\n'
    client.write(request)
})

// 接收服务器的数据
client.on('data', (data) => {
    console.log('data response:\r\n', data.toString())

    // 关闭 client 的连接
    client.destroy()
})

// client 关闭
client.on('close', function() {
    console.log('connection closed')
})
