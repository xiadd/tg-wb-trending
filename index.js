const { Telegraf } = require('telegraf')
const axios = require('axios')

const TOKEN = '684112250:AAEXwWuXJV02QQTjgMoGBSfPMxEp1HeP5Sc'
const CHANNEL_ID = '-1001384658469'
const TRENDING_URL = 'https://m.weibo.cn/api/container/getIndex?containerid=106003type%3D25%26t%3D3%26disable_hot%3D1%26filter_type%3Drealtimehot'

const bot = new Telegraf(TOKEN)

async function bootstrap () {
  const { data } = await axios.get(TRENDING_URL)
  if (data.ok === 1) {
    const items = data.data.cards[0]?.card_group
    if (items) {
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

// bot.sendMessage(CHANNEL_ID, '你好啊👋').then(() => {
//   process.exit(0)
// })