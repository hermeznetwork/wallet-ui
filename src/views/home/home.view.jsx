import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useTheme } from 'react-jss'
import { push } from 'connected-react-router'

import useHomeStyles from './home.styles'
import { fetchAccounts } from '../../store/home/home.thunks'
import TotalBalance from './components/total-balance/total-balance.view'
import AccountList from '../shared/account-list/account-list.view'
import Spinner from '../shared/spinner/spinner.view'
import withAuthGuard from '../shared/with-auth-guard/with-auth-guard.view.jsx'
import { CurrencySymbol } from '../../utils/currencies'
import Container from '../shared/container/container.view'
import { copyToClipboard } from '../../utils/dom'
import Snackbar from '../shared/snackbar/snackbar.view'
import { changeHeader } from '../../store/global/global.actions'
import TransactionActions from '../shared/transaction-actions/transaction-actions.view'

function Home ({
  tokensTask,
  accountsTask,
  metaMaskWalletTask,
  fiatExchangeRatesTask,
  preferredCurrency,
  onChangeHeader,
  onLoadAccounts,
  onNavigateToAccountDetails
}) {
  const theme = useTheme()
  const classes = useHomeStyles()
  const [showAddressCopiedSnackbar, setShowAddressCopiedSnackbar] = React.useState(false)

  React.useEffect(() => {
    onChangeHeader()
  }, [onChangeHeader])

  React.useEffect(() => {
    if (metaMaskWalletTask.status === 'successful' && tokensTask.status === 'successful') {
      onLoadAccounts(metaMaskWalletTask.data.ethereumAddress, tokensTask.data)
    }
  }, [metaMaskWalletTask, tokensTask, onLoadAccounts])

  function getTotalBalance (accounts) {
    if (
      tokensTask.status !== 'successful' ||
      fiatExchangeRatesTask.status !== 'successful'
    ) {
      return undefined
    }

    return accounts.reduce((amount, account) => {
      const tokenSymbol = getTokenSymbol(account.tokenId)
      const tokenRateInUSD = tokensTask.data
        .find((token) => token.symbol === tokenSymbol).USD
      const tokenFiatRate = preferredCurrency === CurrencySymbol.USD
        ? tokenRateInUSD
        : tokenRateInUSD * fiatExchangeRatesTask.data[preferredCurrency]

      return amount + account.balance * tokenFiatRate
    }, 0)
  }

  function getTokenSymbol (tokenId) {
    return tokensTask.data.find((token) => token.tokenId === tokenId).symbol
  }

  function getHermezAddress (ethereumAddress) {
    const firstAddressSlice = ethereumAddress.slice(0, 6)
    const secondAddressSlice = ethereumAddress.slice(
      ethereumAddress.length - 4,
      ethereumAddress.length
    )

    return `hez:${firstAddressSlice} *** ${secondAddressSlice}`
  }

  function handleAccountClick (account) {
    onNavigateToAccountDetails(account.token.tokenId)
  }

  function handleEthereumAddressClick (ethereumAddress) {
    copyToClipboard(`hez:${metaMaskWalletTask.data.ethereumAddress}`)
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
                  onClick={() => handleEthereumAddressClick(metaMaskWalletTask.data.ethereumAddress)}
                >
                  <p>{getHermezAddress(metaMaskWalletTask.data.ethereumAddress)}</p>
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
                      amount={getTotalBalance(accountsTask.data)}
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
                    accounts={accountsTask.data}
                    tokens={tokensTask.status === 'successful' ? tokensTask.data : undefined}
                    preferredCurrency={preferredCurrency}
                    fiatExchangeRates={fiatExchangeRatesTask.status === 'successful' ? fiatExchangeRatesTask.data : undefined}
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
  accountsTask: PropTypes.shape({
    status: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        balance: PropTypes.number.isRequired,
        tokenId: PropTypes.number.isRequired
      })
    ),
    error: PropTypes.string
  }),
  metaMaskWalletTask: PropTypes.shape({
    status: PropTypes.string.isRequired,
    data: PropTypes.object,
    error: PropTypes.string
  }),
  preferredCurrency: PropTypes.string.isRequired,
  tokensTask: PropTypes.shape({
    status: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        tokenId: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        symbol: PropTypes.string.isRequired
      })
    ),
    error: PropTypes.string
  }),
  fiatExchangeRatesTask: PropTypes.shape({
    status: PropTypes.string.isRequired,
    data: PropTypes.object,
    error: PropTypes.string
  }),
  onLoadAccounts: PropTypes.func.isRequired,
  onNavigateToAccountDetails: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  tokensTask: state.global.tokensTask,
  metaMaskWalletTask: state.account.metaMaskWalletTask,
  accountsTask: state.home.accountsTask,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask,
  preferredCurrency: state.settings.preferredCurrency
})

const mapDispatchToProps = (dispatch) => ({
  onChangeHeader: () => dispatch(changeHeader({ type: 'main' })),
  onLoadAccounts: (ethereumAddress, tokens) =>
    dispatch(fetchAccounts(ethereumAddress, tokens)),
  onNavigateToAccountDetails: (tokenId) =>
    dispatch(push(`/accounts/${tokenId}`))
})

export default withAuthGuard(connect(mapStateToProps, mapDispatchToProps)(Home))
