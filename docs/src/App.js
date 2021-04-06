function App() {
  return (
    <div className="d-flex vh-100 text-center text-dark bg-white">
      <div className="d-flex h-100 p-3 mx-auto flex-column" style={{ width: '42em', justifyContent: 'center' }}>
        <main className="px-3">
          <h1>微博热搜聚合</h1>
          <p className="lead">
            使用github action聚合微博热搜，每小时定时执行发送到telegram bot并存档至github
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

            <a
              target="_blank"
              rel="noreferrer"
              href="https://github.com/xiadd/tg-wb-trending"
              className="btn btn-lg btn-outline-dark fw-bold"
              style={{ marginLeft: '1em' }}
            >
              演示
            </a>
          </p>
        </main>
      </div>
    </div>
  )
}

export default App;
