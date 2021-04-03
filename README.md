## 说明

Github Actions每天自动抓取微博热搜归档 [网站](https://xiadd.github.io/tg-wb-trending/)，并且每小时发送热点消息到tg频道[微博实时热搜](https://t.me/weibo_hots)

## 部署

1. 在[BotFather](https://t.me/BotFather) 创建机器人并获取机器人的token

![](https://cdn.jsdelivr.net/gh/xiadd/images@master/uPic/2021-04-03/y6BCCW.png)

2. 创建频道并把机器人设置为频道的管理员

3. 获取频道的id, 可以使用[GetID](https://t.me/getidsbot) 机器人获取频道的id

4. 在github的项目设置中设置TOKEN和CHANNEL_ID

![](https://cdn.jsdelivr.net/gh/xiadd/images@master/uPic/2021-04-03/GDhkx7.png)

5. 将docs/public/CNAME改为自己的域名，github pages设置为gh-pages分支

![](https://cdn.jsdelivr.net/gh/xiadd/images@master/uPic/2021-04-03/CpsJjB.png)

## 开发

1. 使用tg bogfather创建一个机器人
2. 新建一个频道，并把机器人设置成为频道的管理员
3. 在仓库中设置TOKEN为telegram bot的token