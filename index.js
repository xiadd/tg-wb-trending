const fs = require('fs/promises')
const dayjs = require('dayjs')
const _ = require('lodash')
const { Telegraf } = require('telegraf')
const axios = require('axios')

const TOKEN = process.env.TOKEN
const CHANNEL_ID = '-1001384658469'
const TRENDING_URL = 'https://m.weibo.cn/api/container/getIndex?containerid=106003type%3D25%26t%3D3%26disable_hot%3D1%26filter_type%3Drealtimehot'

const bot = new Telegraf(TOKEN)

async function saveRawJson (data) {
  const date = dayjs().format('YYYY-MM-DD')
  const fullPath = `./api/${date}.json`
  const words = data.map(o => ({
    title: o.desc,
    url: o.scheme,
    hot: o.desc_extr,
    ads: !!o.promotion
  }))
  let wordsAlreadyDownload = []
  try {
    await fs.stat(fullPath)
    const content = await fs.readFile(fullPath)
    wordsAlreadyDownload = JSON.parse(content)
  } catch (err) {
    // file not exsit
  }
  const allHots = _.uniqBy(_.concat(words, wordsAlreadyDownload), 'title')
  await fs.writeFile(fullPath, JSON.stringify(allHots))
}

async function sendTgMessage(data) {
  const ranks = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣']
  const text = data.splice(1, 20).map((o, i) => {
    if (o.promotion) {
      return `💰 [${o.desc}](${o.scheme}) ${(o.desc_extr / 10000).toFixed(2)} 万`
    }
    if (ranks[i]) {
      return `${ranks[i]} [${o.desc}](${o.scheme}) ${(o.desc_extr / 10000).toFixed(2)} 万`
    }
    return `🔥 [${o.desc}](${o.scheme}) ${(o.desc_extr / 10000).toFixed(2)} 万`
  })
  text.unshift(`${new Date().toLocaleString()} 的微博热搜`)
  await bot.telegram.sendMessage(CHANNEL_ID, text.join('\n'), {
    parse_mode: 'Markdown',
    disable_web_page_preview: true
  })
}

async function bootstrap () {
  const { data } = await axios.get(TRENDING_URL)
  if (data.ok === 1) {
    const items = data.data.cards[0]?.card_group
    if (items) {
      await saveRawJson(items)
      await sendTgMessage(items)
    }
  }
  process.exit(0)
}

bootstrap()