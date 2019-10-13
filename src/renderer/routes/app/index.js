import React, { Component } from 'react'
import { Router, Switch, Route } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import MainPage from '../mainpage'

const browerHistory = createBrowserHistory({
  basename: '/'
})

class Index extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div>
        <Router history={browerHistory}>
          <Switch>
            <Route path='/' component={MainPage} />
          </Switch>
        </Router>
      </div>
    )
  }
}

export default Index
