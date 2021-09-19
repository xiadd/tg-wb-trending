import fs from 'fs-extra'
import dayjs from 'dayjs'

const files = fs.readdirSync('./api')


for (let file of files) {
  await writeMDFile(file)
}

async function writeMDFile(file) {
  const date = file.split('.')[0]
  const fullPath = `./raw/${date}.md`
  const jsonPath = `./api/${date}.json`
  const words = await fs.readJSON(jsonPath)
  await fs.writeFile(fullPath, `# ${date} 微博热搜 \n`)
  await fs.writeFile(fullPath, words.map(item => {
    return `## [${item.title}](${item.url}) ${item.category ? `\`${item.category?.trim()}\`` : ''} \n ${item.description?.trim() || '暂无描述'}`
  }).join('\n'), {
    flag: 'a'
  })
}