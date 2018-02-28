const fs = require('fs')
const log = require('./utils')

// 引入 Model 模块
const models = require('./models')
const User = models.User
const Message = models.Message

// 保存 message
const messageList = []