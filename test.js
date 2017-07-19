const fs = require('fs')
const authorlist = require('./demo/authorlist.json')

const author = {
  id: 3,
  name: '留手机卡',
  birthday: '1994-08-10',
  nationality: '乌拉圭',
}

authorlist.data.list.push(author)

fs.writeFileSync('./demo/authorlist.json', JSON.stringify(authorlist), 'utf-8')
