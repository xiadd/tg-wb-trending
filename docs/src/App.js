import { Switch, Route } from 'react-router-dom'
import Home from './pages/home'
import Hots from './pages/hots'

function App() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>

      <Route path="/hots">
        <Hots />
      </Route>
    </Switch>
  )
}

export default App;
