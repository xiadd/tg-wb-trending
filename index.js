const fs = require('fs/promises')
const dayjs = require('dayjs')
const _ = require('lodash')
const { Telegraf } = require('telegraf')
const axios = require('axios')

const TOKEN = '684112250:AAEXwWuXJV02QQTjgMoGBSfPMxEp1HeP5Sc'
const CHANNEL_ID = '-1001384658469'
const TRENDING_URL = 'https://m.weibo.cn/api/container/getIndex?containerid=106003type%3D25%26t%3D3%26disable_hot%3D1%26filter_type%3Drealtimehot'

const bot = new Telegraf(TOKEN)

async function saveRawJson (data) {
  const date = dayjs().format('YYYY-MM-DD')
  const fullPath = `./raw/${date}.json`
  const words = data.map(o => ({
    title: o.desc,
    url: o.scheme
  }))
  let wordsAlreadyDownload = []
  try {
    await fs.stat(fullPath)
    const content = await fs.readFile(fullPath)
    wordsAlreadyDownload = JSON.parse(content)
  } catch (err) {
    // file not exsit
  }
  const allHots = _.merge(words, wordsAlreadyDownload)
  await fs.writeFile(fullPath, JSON.stringify(allHots))
}

async function bootstrap () {
  const { data } = await axios.get(TRENDING_URL)
  if (data.ok === 1) {
    const items = data.data.cards[0]?.card_group
    if (items) {
      await saveRawJson(items)
      const ranks = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣']
      const text = items.splice(1, 20).map((o, i) => {
        if (ranks[i]) {
          return `${ranks[i]} [${o.desc}](${o.scheme})`
        }
        return `🔥 [${o.desc}](${o.scheme})`
      })
      await bot.telegram.sendMessage(CHANNEL_ID, new Date().toLocaleString() + '的微博热搜\n' + text.join('\n'), {
        parse_mode: 'Markdown',
        disable_web_page_preview: true
      })
    }
  }
  process.exit(0)
}

bootstrap()