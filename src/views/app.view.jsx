import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import useAppStyles from './app.styles'
import Layout from './shared/layout/layout.view'
import routes from '../routing/routes'
import { fetchConfig, fetchTokens, fetchFiatExchangeRates } from '../store/global/global.thunks'
import Spinner from './shared/spinner/spinner.view'
import Login from './login/login.view'
import { CurrencySymbol } from '../utils/currencies'

function App ({
  configTask,
  tokensTask,
  fiatExchangeRatesTask,
  onLoadConfig,
  onLoadTokens,
  onLoadFiatExchangeRates
}) {
  useAppStyles()

  React.useEffect(() => {
    onLoadConfig()
    onLoadTokens()
    onLoadFiatExchangeRates()
  }, [onLoadConfig, onLoadTokens, onLoadFiatExchangeRates])

  if (
    configTask.status === 'loading' ||
    tokensTask.status === 'loading' ||
    fiatExchangeRatesTask.status === 'loading'
  ) {
    return <Spinner />
  }

  if (
    configTask.status === 'failed' ||
    tokensTask.status === 'failed' ||
    fiatExchangeRatesTask.status === 'failed'
  ) {
    return <p>{configTask.error || tokensTask.error || fiatExchangeRatesTask.error}</p>
  }

  return (
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
            <Redirect to='/' />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  )
}

App.propTypes = {
  tokensTask: PropTypes.shape({
    status: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        tokenId: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        symbol: PropTypes.string.isRequired
      })
    )
  }),
  fiatExchangeRatesTask: PropTypes.shape({
    status: PropTypes.string.isRequired,
    data: PropTypes.object
  }),
  onLoadConfig: PropTypes.func.isRequired,
  onLoadTokens: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  configTask: state.global.configTask,
  tokensTask: state.global.tokensTask,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask
})

const mapDispatchToProps = (dispatch) => ({
  onLoadConfig: () => dispatch(fetchConfig()),
  onLoadTokens: () => dispatch(fetchTokens()),
  onLoadFiatExchangeRates: () => dispatch(
    fetchFiatExchangeRates(
      Object.values(CurrencySymbol).filter(currency => currency !== CurrencySymbol.USD)
    )
  )
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
