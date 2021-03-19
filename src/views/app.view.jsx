import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { useTheme } from 'react-jss'

import useAppStyles from './app.styles'
import Layout from './shared/layout/layout.view'
import routes from '../routing/routes'
import * as globalThunks from '../store/global/global.thunks'
import Spinner from './shared/spinner/spinner.view'
import { CurrencySymbol } from '../utils/currencies'
import { RETRY_POOL_TXS_RATE } from '../constants'

function App ({
  wallet,
  ethereumNetworkTask,
  fiatExchangeRatesTask,
  onLoadFiatExchangeRates,
  onChangeNetworkStatus,
  onDisconnectAccount,
  onLoadCoordinatorState,
  onSetHermezEnvironment,
  onCheckPendingTransactions,
  onReloadApp
}) {
  const theme = useTheme()
  const classes = useAppStyles()

  React.useEffect(() => {
    onSetHermezEnvironment()
  }, [onSetHermezEnvironment])

  React.useEffect(() => {
    onLoadFiatExchangeRates()
  }, [onLoadFiatExchangeRates])

  React.useEffect(() => {
    if (ethereumNetworkTask.status === 'successful') {
      onLoadCoordinatorState()
    }
  }, [ethereumNetworkTask, onLoadCoordinatorState])

  React.useEffect(() => {
    let intervalId

    if (wallet) {
      intervalId = setInterval(onCheckPendingTransactions, RETRY_POOL_TXS_RATE)
    }

    return () => { intervalId && clearInterval(intervalId) }
  }, [wallet])

  React.useEffect(() => {
    window.addEventListener('online', () => {
      onChangeNetworkStatus('online', theme.palette.green)
    })
  }, [theme, onChangeNetworkStatus])

  React.useEffect(() => {
    window.addEventListener('offline', () => onChangeNetworkStatus('offline'))
  }, [theme, onChangeNetworkStatus])

  React.useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => { onDisconnectAccount() })
      window.ethereum.on('chainChanged', () => { onReloadApp() })
    }
  }, [onDisconnectAccount, onReloadApp])

  if (
    ethereumNetworkTask.status === 'pending' ||
    ethereumNetworkTask.status === 'loading' ||
    fiatExchangeRatesTask.status === 'loading' ||
    fiatExchangeRatesTask.status === 'failure'
  ) {
    return (
      <div className={classes.root}>
        <Spinner size={theme.spacing(8)} />
      </div>
    )
  }

  return (
    <Layout>
      <Switch>
        {routes.map(route =>
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
  )
}

App.propTypes = {
  fiatExchangeRatesTask: PropTypes.object
}

const mapStateToProps = (state) => ({
  wallet: state.global.wallet,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask,
  ethereumNetworkTask: state.global.ethereumNetworkTask
})

const mapDispatchToProps = (dispatch) => ({
  onSetHermezEnvironment: () => dispatch(globalThunks.setHermezEnvironment()),
  onLoadFiatExchangeRates: () =>
    dispatch(
      globalThunks.fetchFiatExchangeRates(
        Object.values(CurrencySymbol)
          .filter(currency => currency.code !== CurrencySymbol.USD.code)
          .map((currency) => currency.code)
      )
    ),
  onCheckPendingTransactions: () => dispatch(globalThunks.checkPendingTransactions()),
  onChangeNetworkStatus: (networkStatus, backgroundColor) =>
    dispatch(globalThunks.changeNetworkStatus(networkStatus, backgroundColor)),
  onDisconnectAccount: () => dispatch(globalThunks.disconnectWallet()),
  onLoadCoordinatorState: () => dispatch(globalThunks.fetchCoordinatorState()),
  onReloadApp: () => dispatch(globalThunks.reloadApp())
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
