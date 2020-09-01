import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Layout from './shared/layout/layout.view'
import routes from '../routing/routes'
import { fetchConfig, fetchTokens } from '../store/global/global.thunks'
import Spinner from './shared/spinner/spinner.view'
import Login from './login/login.view'

function App ({ configTask, tokensTask, onLoadConfig, onLoadTokens }) {
  React.useEffect(() => {
    onLoadConfig()
    onLoadTokens()
  }, [onLoadConfig, onLoadTokens])

  if (configTask.status === 'loading' || tokensTask.status === 'loading') {
    return <Spinner />
  }

  if (configTask.status === 'failed' || tokensTask.status === 'failed') {
    return <p>{configTask.error || tokensTask.error}</p>
  }

  return (
    <BrowserRouter>
      <Switch>
        {routes
          .filter(route => !route.renderLayout)
          .map(route =>
            <Route
              exact
              key={route.path}
              path={route.path}
              component={route.component}
            />
          )}
        <Route path='/login' exact component={Login} />
        <Route>
          <Layout>
            <Switch>
              {routes
                .filter(route => route.renderLayout)
                .map(route =>
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
      </Switch>
    </BrowserRouter>
  )
}

App.propTypes = {
  tokensTask: PropTypes.shape({
    status: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        TokenID: PropTypes.number.isRequired,
        Name: PropTypes.string.isRequired,
        Symbol: PropTypes.string.isRequired
      })
    )
  }),
  onLoadConfig: PropTypes.func.isRequired,
  onLoadTokens: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  configTask: state.global.configTask,
  tokensTask: state.global.tokensTask
})

const mapDispatchToProps = (dispatch) => ({
  onLoadConfig: () => dispatch(fetchConfig()),
  onLoadTokens: () => dispatch(fetchTokens())
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
