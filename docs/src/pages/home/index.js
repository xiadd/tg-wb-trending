import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="d-flex vh-100 text-center text-dark bg-white">
      <div className="d-flex h-100 p-3 mx-auto flex-column" style={{ width: '42em', justifyContent: 'center' }}>
        <main className="px-3">
          <h1>微博热搜聚合</h1>
          <p className="lead">
            使用github action聚合微博热搜，每小时定时执行发送到
            <a
              target="_blank"
              rel="noreferrer"
              href="https://t.me/weibo_hots"
              className="text-danger"
            >
              telegram bot
            </a>
            并存档至github
          </p>
          <p className="lead">
            <a
              target="_blank"
              rel="noreferrer"
              href="https://github.com/xiadd/tg-wb-trending"
              className="btn btn-lg btn-dark fw-bold"
            >
              Github
            </a>

            <Link
              to="/hots"
              className="btn btn-lg btn-outline-dark fw-bold"
              style={{ marginLeft: '1em' }}
            >
              演示
            </Link>
          </p>
        </main>
      </div>
    </div>
  )
}

export default Home;
