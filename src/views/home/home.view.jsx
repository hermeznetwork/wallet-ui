import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useTheme } from 'react-jss'
import { push } from 'connected-react-router'

import useHomeStyles from './home.styles'
import { fetchAccounts, fetchUSDTokenExchangeRates } from '../../store/home/home.thunks'
import TotalBalance from './components/total-balance/total-balance.view'
import AccountList from '../shared/account-list/account-list.view'
import Spinner from '../shared/spinner/spinner.view'
import withAuthGuard from '../shared/with-auth-guard/with-auth-guard.view.jsx'
import { getTokenFiatExchangeRate } from '../../utils/currencies'
import Container from '../shared/container/container.view'
import { copyToClipboard } from '../../utils/dom'
import Snackbar from '../shared/snackbar/snackbar.view'
import { changeHeader } from '../../store/global/global.actions'
import TransactionActions from '../shared/transaction-actions/transaction-actions.view'
import { getPartiallyHiddenHermezAddress } from '../../utils/addresses'

function Home ({
  metaMaskWalletTask,
  accountsTask,
  usdTokenExchangeRatesTask,
  fiatExchangeRatesTask,
  preferredCurrency,
  onChangeHeader,
  onLoadAccounts,
  onLoadUSDTokenExchangeRates,
  onNavigateToAccountDetails
}) {
  const theme = useTheme()
  const classes = useHomeStyles()
  const [showAddressCopiedSnackbar, setShowAddressCopiedSnackbar] = React.useState(false)

  React.useEffect(() => {
    onChangeHeader()
  }, [onChangeHeader])

  React.useEffect(() => {
    if (metaMaskWalletTask.status === 'successful') {
      onLoadAccounts(metaMaskWalletTask.data.hermezEthereumAddress)
    }
  }, [metaMaskWalletTask, onLoadAccounts])

  React.useEffect(() => {
    if (accountsTask.status === 'successful') {
      onLoadUSDTokenExchangeRates(
        accountsTask.data.accounts.map(account => account.tokenId)
      )
    }
  }, [accountsTask, onLoadUSDTokenExchangeRates])

  function getTotalBalance (accounts) {
    if (
      usdTokenExchangeRatesTask.status !== 'successful' ||
      fiatExchangeRatesTask.status !== 'successful'
    ) {
      return undefined
    }

    return accounts.reduce((amount, account) => {
      const tokenFiatExchangeRate = getTokenFiatExchangeRate(
        account.tokenSymbol,
        preferredCurrency,
        usdTokenExchangeRatesTask.data,
        fiatExchangeRatesTask.data
      )

      return amount + account.balance * tokenFiatExchangeRate
    }, 0)
  }

  function handleAccountClick (account) {
    onNavigateToAccountDetails(account.accountIndex)
  }

  function handleEthereumAddressClick (hermezEthereumAddress) {
    copyToClipboard(hermezEthereumAddress)
    setShowAddressCopiedSnackbar(true)
  }

  function handleAddressCopiedSnackbarClose () {
    setShowAddressCopiedSnackbar(false)
  }

  return (
    <div className={classes.root}>
      <Container backgroundColor={theme.palette.primary.main} disableTopGutter>
        <section className={classes.section}>
          {
            metaMaskWalletTask.status !== 'successful'
              ? <></>
              : (
                <div
                  className={classes.hermezAddress}
                  onClick={() => handleEthereumAddressClick(metaMaskWalletTask.data.hermezEthereumAddress)}
                >
                  <p>{getPartiallyHiddenHermezAddress(metaMaskWalletTask.data.hermezEthereumAddress)}</p>
                </div>
              )
          }
          <div className={classes.totalBalance}>
            {(() => {
              switch (accountsTask.status) {
                case 'loading': {
                  return <Spinner />
                }
                case 'failed': {
                  return (
                    <TotalBalance
                      amount={undefined}
                      currency={preferredCurrency}
                    />
                  )
                }
                case 'successful': {
                  return (
                    <TotalBalance
                      amount={getTotalBalance(accountsTask.data.accounts)}
                      currency={preferredCurrency}
                    />
                  )
                }
                default: {
                  return <></>
                }
              }
            })()}
          </div>
          <TransactionActions hideWithdraw />
        </section>
      </Container>
      <Container>
        <section className={classes.section}>
          {(() => {
            switch (accountsTask.status) {
              case 'loading': {
                return <Spinner />
              }
              case 'failed': {
                return <p>{accountsTask.error}</p>
              }
              case 'successful': {
                return (
                  <AccountList
                    accounts={accountsTask.data.accounts}
                    preferredCurrency={preferredCurrency}
                    usdTokenExchangeRates={
                      usdTokenExchangeRatesTask.status === 'successful'
                        ? usdTokenExchangeRatesTask.data
                        : undefined
                    }
                    fiatExchangeRates={
                      fiatExchangeRatesTask.status === 'successful'
                        ? fiatExchangeRatesTask.data
                        : undefined
                    }
                    onAccountClick={handleAccountClick}
                  />
                )
              }
              default: {
                return <></>
              }
            }
          })()}
        </section>
      </Container>
      <Snackbar
        show={showAddressCopiedSnackbar}
        message='The Hermez address has been copied to the clipboard!'
        onClose={handleAddressCopiedSnackbarClose}
      />
    </div>
  )
}

Home.propTypes = {
  accountsTask: PropTypes.object,
  metaMaskWalletTask: PropTypes.object,
  preferredCurrency: PropTypes.string.isRequired,
  usdTokenExchangeRatesTask: PropTypes.object,
  fiatExchangeRatesTask: PropTypes.object,
  onLoadAccounts: PropTypes.func.isRequired,
  onLoadUSDTokenExchangeRates: PropTypes.func.isRequired,
  onNavigateToAccountDetails: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  tokensTask: state.global.tokensTask,
  metaMaskWalletTask: state.account.metaMaskWalletTask,
  accountsTask: state.home.accountsTask,
  usdTokenExchangeRatesTask: state.home.usdTokenExchangeRatesTask,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask,
  preferredCurrency: state.settings.preferredCurrency
})

const mapDispatchToProps = (dispatch) => ({
  onChangeHeader: () => dispatch(changeHeader({ type: 'main' })),
  onLoadAccounts: (hermezEthereumAddress) =>
    dispatch(fetchAccounts(hermezEthereumAddress)),
  onLoadUSDTokenExchangeRates: (tokenIds) =>
    dispatch(fetchUSDTokenExchangeRates(tokenIds)),
  onNavigateToAccountDetails: (accountIndex) =>
    dispatch(push(`/accounts/${accountIndex}`))
})

export default withAuthGuard(connect(mapStateToProps, mapDispatchToProps)(Home))
