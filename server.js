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

router.get('/api/authorlist', async function (ctx) {
  await send(ctx, 'demo/authorlist.json')
})
router.post('/api/author', async function (ctx) {
  const authorData = ctx.request.body
  const authorlist = require('./demo/authorlist.json')
  let isNew = true
  let curId = 0
  authorlist.data.list.forEach((author) => {
    curId++
    if(author.name === authorData.name) {
      author.name = authorData.name
      author.birthday = authorData.birthday
      author.nationality = authorData.nationality
      isNew = false
    }
  })
  if(isNew) {
    authorlist.data.list.push({
      id: curId + 1,
      name: authorData.name,
      birthday: authorData.birthday,
      nationality: authorData.nationality,
    })
  }
  fs.writeFileSync('./demo/authorlist.json', JSON.stringify(authorlist))
  await send(ctx, './demo/authorlist.json')
})
router.get('/api/author/:id', async function (ctx) {
  const id = ctx.params.id
  const authorlist = require('./demo/authorlist.json')
  const author = authorlist.data.list[id - 1]
  const authorData = require('./demo/author.json')
  authorData.data.id = author.id
  authorData.data.name = author.name
  authorData.data.birthday = author.birthday
  authorData.data.nationality = author.nationality
  fs.writeFileSync('./demo/author.json', JSON.stringify(authorData))
  await send(ctx, './demo/author.json')
})
router.delete('/api/author', async function(ctx) {
  const id = parseInt(ctx.request.body.id)
  console.log(id)
  const authorlist = require('./demo/authorlist.json')
  authorlist.data.list.forEach((author, index) => {
    if(author.id > id) {
      author.id--
      authorlist.data.list[index - 1] = author
    }
  })
  authorlist.data.list.pop()
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