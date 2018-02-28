const fs = require('fs')
const log = require('./utils')

// 引入 Model 模块
const models = require('./models')
const User = models.User
const Message = models.Message

// 保存 message
const messageList = []

// 读取 html 文件的函数
const template = name => {
    const path = 'templates/' + name
    const options = {
        encoding: 'utf8'
    }
    
    const content = fs.readFileSync(path, options)
    return content
}

// 主页处理函数
const index = () => {
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n'
    const body = template('index.html')
    const r = header + '\r\n' + body
    return r
}

// 登录处理函数
const login = request => {
    let result
    if(request.method === 'post') {
        const form = request.form()
        const u = User.create(form)
        
        if(u.validateLogin()) {
            result = '登录成功'
        } else {
            result = '用户名或密码错误'
        }
    } else {
        result = ''
    }
    
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n'
    let body = template('login.html')
    body = body.replace('{{result}}', result)
    const r = header + '\r\n' + body
    return r
}

// 注册处理函数
const register = request => {
    let result
    if(request.method === 'POST') {
        const form = request.form()
        const u = User.create(form)
        if(u.validateRegister()) {
            u.save()
            const us = User.all()
            result = `注册成功<br><pre>${us}</pre>`
        } else {
            result = '用户名活着密码长度必须大于2'
        }
    } else {
        result = ''
    }
    
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n'
    let body = template('register.html')
    body = body.replace('{{result}}', result)
    const r = header + '\r\n' + body
    return r
}

// 留言板处理函数
const message = request => {
    if(request.method === 'POST') {
        const form = request.form()
        const m = Message.create(form)
        messageList.push(m)
    }
    
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n'
    let body = template('message.html')
    const s = messageList.map(m => {
        return m.toString()
    }).join('<br>')
    body = body.replace('{{messages}}', s)
    const r = header + '\r\n' + body
    return r
}

const static = request => {
    const filename = request.query.file || 'doge.gif'
    const path = `static/${filename}`
    const body = fs.readFileSync(path)
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: image/gif\r\n\r\n'
    const h = Buffer.from(header)
    const r = Buffer.concat([h, body])
    return r
}

const routeMapper = {
    '/': index,
    '/static': static,
    '/login': login,
    '/register': register,
    '/message': message,
}

module.exports = routeMapper