import fs from 'fs/promises'
import util from 'util'
import dayjs from 'dayjs'
import cheerio from 'cheerio'
import _ from 'lodash'
import telegraf from 'telegraf'
import axios from 'axios'

const { Telegraf } = telegraf

const TOKEN = process.env.TOKEN
const CHANNEL_ID = process.env.CHANNEL_ID
const TRENDING_URL = 'https://m.weibo.cn/api/container/getIndex?containerid=106003type%3D25%26t%3D3%26disable_hot%3D1%26filter_type%3Drealtimehot'
const TRENDING_DETAIL_URL = 'https://m.s.weibo.com/topic/detail?q=%s'

const bot = new Telegraf(TOKEN)

async function saveRawJson (data) {
  const date = dayjs().format('YYYY-MM-DD')
  const fullPath = `./api/${date}.json`
  const words = data.map(o => ({
    title: o.desc,
    category: o.category,
    description: o.description,
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
  const text = data.splice(1, 50).map((o, i) => {
    const containerid = encodeURIComponent(new URL(o.scheme).searchParams.get('containerid'))
    const url = `https://m.weibo.cn/search?containerid=${containerid}`
    if (o.promotion) {
      return `💰 [${o.desc}](${url}) ${(o.desc_extr / 10000).toFixed(2)} 万`
    }
    if (ranks[i]) {
      return `${ranks[i]} [${o.desc}](${url}) ${(o.desc_extr / 10000).toFixed(2)} 万`
    }
    return `🔥 [${o.desc}](${url}) ${(o.desc_extr / 10000).toFixed(2)} 万`
  })
  text.unshift(`${dayjs().format('YYYY-MM-DD HH:mm:ss')} 的微博热搜([查看更多](https://weibo.juhe.im/#/hots?date=${dayjs().format('YYYY-MM-DD')}))`)
  await bot.telegram.sendMessage(CHANNEL_ID, text.join('\n'), {
    parse_mode: 'Markdown',
    disable_web_page_preview: true
  })
}

async function fetchTrendingDetail (title) {
  try {
    const { data } = await axios.get(util.format(TRENDING_DETAIL_URL, title))
    const $ = cheerio.load(data)
    return {
      category: $('#pl_topicband dl>dd').first().text(),
      desc: $('#pl_topicband dl>dd').last().text()
    }
  } catch {
    return {}
  }
}

async function bootstrap () {
  const { data } = await axios.get(TRENDING_URL)
  if (data.ok === 1) {
    const items = data.data.cards[0]?.card_group
    if (items) {
      for (let item of items) {
        const { category, desc } = await fetchTrendingDetail(encodeURIComponent(item.desc))
        item.category = category || item.category
        item.description = desc || item.description
      }
      await saveRawJson(items)
      await sendTgMessage(items)
    }
  }
  process.exit(0)
}

bootstrap() 
