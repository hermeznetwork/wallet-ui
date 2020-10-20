import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { useTheme } from 'react-jss'

import { initializeTransactionPool } from '../utils/tx-pool'
import useAppStyles from './app.styles'
import Layout from './shared/layout/layout.view'
import routes from '../routing/routes'
import { fetchConfig, fetchFiatExchangeRates } from '../store/global/global.thunks'
import Spinner from './shared/spinner/spinner.view'
import { CurrencySymbol } from '../utils/currencies'

function App ({
  configTask,
  fiatExchangeRatesTask,
  onLoadConfig,
  onLoadFiatExchangeRates
}) {
  const theme = useTheme()
  const classes = useAppStyles()

  React.useEffect(() => {
    onLoadConfig()
    onLoadFiatExchangeRates()
  }, [onLoadConfig, onLoadFiatExchangeRates])

  React.useEffect(() => {
    initializeTransactionPool()
  }, [])

  if (configTask.status === 'loading' || fiatExchangeRatesTask.status === 'loading') {
    return (
      <div className={classes.root}>
        <Spinner size={theme.spacing(8)} />
      </div>
    )
  }

  if (configTask.status === 'failed' || fiatExchangeRatesTask.status === 'failed') {
    return <p>{configTask.error || fiatExchangeRatesTask.error}</p>
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
            render={route.render}
          />
        )}
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
                  render={route.render}
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
  fiatExchangeRatesTask: PropTypes.shape({
    status: PropTypes.string.isRequired,
    data: PropTypes.object
  }),
  onLoadConfig: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  configTask: state.global.configTask,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask
})

const mapDispatchToProps = (dispatch) => ({
  onLoadConfig: () => dispatch(fetchConfig()),
  onLoadFiatExchangeRates: () => dispatch(
    fetchFiatExchangeRates(
      Object.values(CurrencySymbol)
        .filter(currency => currency.code !== CurrencySymbol.USD.code)
        .map((currency) => currency.code)
    )
  )
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
