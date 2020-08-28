import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Layout from './shared/layout/layout.view'
import routes from '../routing/routes'
import { fetchTokens } from '../store/global/global.thunks'

function App ({ onLoadTokens }) {
  React.useEffect(() => {
    onLoadTokens()
  }, [onLoadTokens])

  return (
    <BrowserRouter>
      <Route>
        <Layout>
          <Switch>
            {routes.map(route =>
              <Route
                exact
                key={route.path}
                path={route.path}
                component={route.component}
              />
            )}
          </Switch>
        </Layout>
      </Route>
    </BrowserRouter>
  )
}

App.propTypes = {
  onLoadTokens: PropTypes.func.isRequired
}

const mapDispatchToProps = (dispatch) => ({
  onLoadTokens: () => dispatch(fetchTokens())
})

export default connect(undefined, mapDispatchToProps)(App)
