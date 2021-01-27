import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { useTheme } from 'react-jss'
import hermez from '@hermeznetwork/hermezjs'

import useAppStyles from './app.styles'
import Layout from './shared/layout/layout.view'
import routes from '../routing/routes'
import { fetchCoordinatorState, fetchFiatExchangeRates, changeNetworkStatus, disconnectMetaMaskWallet } from '../store/global/global.thunks'
import Spinner from './shared/spinner/spinner.view'
import { CurrencySymbol } from '../utils/currencies'

function App ({
  fiatExchangeRatesTask,
  coordinatorStateTask,
  onLoadFiatExchangeRates,
  onChangeNetworkStatus,
  onDisconnectAccount,
  onLoadCoordinatorState
}) {
  const theme = useTheme()
  const classes = useAppStyles()

  React.useEffect(() => {
    onLoadFiatExchangeRates()
  }, [onLoadFiatExchangeRates])

  React.useLayoutEffect(() => {
    hermez.Constants._setContractAddress(
      hermez.Constants.ContractNames.Hermez,
      process.env.REACT_APP_HERMEZ_CONTRACT_ADDRESS
    )
    hermez.Constants._setContractAddress(
      hermez.Constants.ContractNames.WithdrawalDelayer,
      process.env.REACT_APP_WITHDRAWAL_DELAYER_CONTRACT_ADDRESS
    )
    hermez.CoordinatorAPI.setBaseApiUrl(process.env.REACT_APP_HERMEZ_API_URL)
    hermez.TxPool.initializeTransactionPool()
  }, [])

  React.useLayoutEffect(() => {
    onLoadCoordinatorState()
  }, [onLoadCoordinatorState])

  React.useLayoutEffect(() => {
    if (coordinatorStateTask.status === 'successful') {
      const forgers = coordinatorStateTask.data.network.nextForgers
      if (forgers && forgers.length > 0) {
        hermez.CoordinatorAPI.setBaseApiUrl(forgers[0].coordinator.URL)
      }
    }
  }, [coordinatorStateTask])

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
      window.ethereum.on('accountsChanged', () => {
        onDisconnectAccount()
      })
    }
  }, [onDisconnectAccount])

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
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask,
  coordinatorStateTask: state.global.coordinatorStateTask
})

const mapDispatchToProps = (dispatch) => ({
  onLoadFiatExchangeRates: () =>
    dispatch(
      fetchFiatExchangeRates(
        Object.values(CurrencySymbol)
          .filter(currency => currency.code !== CurrencySymbol.USD.code)
          .map((currency) => currency.code)
      )
    ),
  onChangeNetworkStatus: (networkStatus, backgroundColor) =>
    dispatch(changeNetworkStatus(networkStatus, backgroundColor)),
  onDisconnectAccount: () => dispatch(disconnectMetaMaskWallet()),
  onLoadCoordinatorState: () => dispatch(fetchCoordinatorState())
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
