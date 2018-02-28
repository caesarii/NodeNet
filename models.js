const fs = require('fs')
const log = require('./utils')

// 检查文件是否存在，不存在则创建
const ensureExists = path => {
    if(!fs.existsSync(path)) {
        const data = '[]'
        fs.writeFileSync(path, data)
    }
}

// 持久化数据: 将数据写入到文件
const save = (data, path) => {
    const s = JSON.stringify(data, null, 2)
    fs.writeFileSync(path, s)
}

// 从文件加载数据
const load = path => {
    // 参数
    const options = {
        encoding: 'utf8'
    }
    
    ensureExists(path)
    const s = fs.readFileSync(path, options)
    const data = JSON.parse(s)
    return data
    
}

// Model 基类
class Model {
    constructor() {
        this.id = undefined
    }
    
    // 返回 db 文件的路径
    static dbPath() {
        const classname = this.name.toLowerCase()
        const path = `${classname}.txt`
        return path
    }
    
    // 获取类的所有实例
    static all() {
        const path = this.dbPath()
        const models = load(path)
        const ms = models.map( item => {
            return this.create(item)
        })
        return ms
    }
    
    
    // 保存实例
    save() {
        const cls = this.constructor
        const models = cls.all()
        const len = models.length
        
        // 如果没有当前实例则创建
        const searchResult = cls.findBy('username', this.username)
        if(searchResult === null) {
            this.id = len + 1
        }
        
        
        models.push(this)
        const path = cls.dbPath()
        save(models, path)
    }
    
    toString() {
        const s = JSON.stringify(this, null, 2)
        return s
    }
}

class User extends Model {
    constructor(form = {}) {
        super()
        this.username = form || ''
        this.password = form.password || ''
    }
    
    // 重建实例
    static create(form = {}) {
        const cls = this
        const instance = new cls(form)
        return instance
    }
    
    // 查询: 返回对应的实例
    static findBy(key, val) {
        const allUsers = this.all()
        for(let user of allUsers) {
            if(user[key] === val) {
                const userInst = this.create(user)
                return userInst
            }
        }
        return null
    }
    
    static findAll(key, val) {
        const allUsers = this.all()
        const result = allUsers.fiter(user => {
            return user[key] === val
        })
        return result
    }
    
    // 校验登录
    validateLogin() {
        const cls = this.constructor
        const allUsers = cls.all()
        
        // 当前用户
        const username = this.username
        const password = this.password
        
        // 验证
        for(let user of allUsers) {
            const isLegal = username === user.username && password === user.password
            if(isLegal) {
                return isLegal
            }
        }
    }
    
    // 校验注册
    validateRegister() {
        return this.username.length > 2 && this.password.length > 2
    }
}


class Message extends Model {
    constructor(form = {}) {
        super()
        this.author = form.author || ''
        this.message = form.message || ''
    }
    
    static create(form = {}) {
        const cls = this
        const instance = new cls(form)
        return instance
    }
}

module.exports = {
    User: User,
    Message: Message,
}