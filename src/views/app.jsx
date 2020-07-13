import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

import './app.css'
import InitView from './auth/init-view'
import ActionView from './transactions/action-view'

function App () {
  return (
    <BrowserRouter>
      <Route
        exact
        path='/'
        component={InitView}
      />
      <Route
        exact
        path='/actions'
        component={ActionView}
      />
    </BrowserRouter>
  )
}

export default (App)
