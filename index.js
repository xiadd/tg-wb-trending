const TelegramBot = require('node-telegram-bot-api')

const TOKEN = '684112250:AAEXwWuXJV02QQTjgMoGBSfPMxEp1HeP5Sc'
const CHANNEL_ID = '-1001384658469'

const bot = new TelegramBot(TOKEN, { polling: true })

bot.sendMessage(CHANNEL_ID, 'HELLO WORLD').then(() => {
  process.exit(0)
})