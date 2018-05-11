import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Home from './pages/Home'
import registerServiceWorker from './registerServiceWorker'
import { Router, Route, Switch } from 'react-router'
import './styles/index.css'
import createHashHistory from 'history/createBrowserHistory'
import User from './pages/User'
import SignIn from './pages/SignIn'
import Music from './pages/Music'
const history = createHashHistory()

ReactDOM.render(
  <Router history={history}>
    <Switch>
      <Route exact={true} path="/" component={Home} />
      <Route path="/user" component={User} />
      <Route path="/sign_in" component={SignIn} />
      <Route path="/music" component={Music} />
    </Switch>
  </Router>,
  document.getElementById('root') as HTMLElement
)

registerServiceWorker()
