const NodeNet = require('../NodeNet')
const log = console.log

const app = new NodeNet()

// TODO 一次配置所有静态资源
const resources = (req, res) => {
    const filename = req.query.file
    const path = `static/${filename}`
    return res.static(path)
}

const index = (req, res) => {
    return res.render('index.html', {name: 'qinghe'})
}

app.use('/', index)
app.use('/static', resources)
app.listen('0.0.0.0', 3000)