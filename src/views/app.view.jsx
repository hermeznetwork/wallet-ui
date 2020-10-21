import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { useTheme } from 'react-jss'

import { initializeTransactionPool } from '../utils/tx-pool'
import useAppStyles from './app.styles'
import Layout from './shared/layout/layout.view'
import routes from '../routing/routes'
import { fetchFiatExchangeRates } from '../store/global/global.thunks'
import Spinner from './shared/spinner/spinner.view'
import { CurrencySymbol } from '../utils/currencies'

function App ({
  fiatExchangeRatesTask,
  onLoadFiatExchangeRates
}) {
  const theme = useTheme()
  const classes = useAppStyles()

  React.useEffect(() => {
    onLoadFiatExchangeRates()
  }, [onLoadFiatExchangeRates])

  React.useEffect(() => {
    initializeTransactionPool()
  }, [])

  if (
    fiatExchangeRatesTask.status === 'loading' ||
    fiatExchangeRatesTask.status === 'failed'
  ) {
    return (
      <div className={classes.root}>
        <Spinner size={theme.spacing(8)} />
      </div>
    )
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
  })
}

const mapStateToProps = (state) => ({
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask
})

const mapDispatchToProps = (dispatch) => ({
  onLoadFiatExchangeRates: () => dispatch(
    fetchFiatExchangeRates(
      Object.values(CurrencySymbol)
        .filter(currency => currency.code !== CurrencySymbol.USD.code)
        .map((currency) => currency.code)
    )
  )
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
