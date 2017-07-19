const Koa = require('koa')
const send = require('koa-send')
const Router = require('koa-router')
var bodyParser = require('koa-bodyparser')
const fs = require('fs')

const app = new Koa()
app.use(bodyParser())
const router = new Router()

const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const config = require('./webpack.dev.config')

const DEVPORT = 3001

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  quiet: false,
  noInfo: true,
  stats: {
    colors: true
  }
}).listen(DEVPORT, 'localhost', function (err, result) {
  if (err) {
    return console.log(err)
  }
})

router.get('/', async function (ctx) {
  await send(ctx, 'demo/index.html')
})

// 线上会使用压缩版本的React，而在开发的时候，我们需要使用react-with-addons的版本来查看错误信息
// 所以这里我通常会把React和ReactDOM代理到本地未压缩的文件
router.get('**/react.min.js', async function (ctx) {
  await send(ctx, 'demo/react-with-addons.js')
})
router.get('**/react-dom.min.js', async function (ctx) {
  await send(ctx, 'demo/react-dom.js')
})

// CRUD 接口

// 获取列表数据
router.get('/api/authorlist', async function (ctx) {
  await send(ctx, 'demo/authorlist.json')
})

// 根据id获取单条记录
router.get('/api/author/:id', async function (ctx) {
  const id = ctx.params.id
  const authorlist = require('./demo/authorlist.json')
  const author = authorlist.data.list[id - 1]
  const authorData = require('./demo/author.json')
  Object.assign(authorData.data, author)
  fs.writeFileSync('./demo/author.json', JSON.stringify(authorData))
  await send(ctx, './demo/author.json')
})

// 添加或编辑数据
router.post('/api/author', async function (ctx) {
  const authorData = ctx.request.body
  const authorlist = require('./demo/authorlist.json')
  let isNew = true
  let curId = 0
  authorlist.data.list.forEach((author) => {
    curId++
    if(author.id == authorData.id) {
      Object.assign(author, authorData)
      isNew = false
    }
  })
  if(isNew) {
    authorlist.data.list.push(Object.assign({}, { id: curId + 1 }, authorData))
  }
  fs.writeFileSync('./demo/authorlist.json', JSON.stringify(authorlist))
  await send(ctx, './demo/authorlist.json')
})

// 删除一条数据
router.delete('/api/author', async function(ctx) {
  const id = parseInt(ctx.request.body.id)
  const authorlist = require('./demo/authorlist.json')
  authorlist.data.list.splice(id - 1, 1)
  for( let i = id - 1; i < authorlist.data.list.length; i++) {
    authorlist.data.list[i].id--
  }
  fs.writeFileSync('./demo/authorlist.json', JSON.stringify(authorlist))
  await send(ctx, './demo/authorlist.json')
})

router.get('**/*.js(on)?', async function (ctx) {
  ctx.redirect(`http://localhost:${DEVPORT}/${ctx.path}`)
})

app.use(router.routes())

app.listen(3000, function () {
  console.log('server running on http://localhost:3000')
})