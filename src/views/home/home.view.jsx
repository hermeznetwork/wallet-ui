import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import useHomeStyles from './home.styles'
import { fetchAccounts } from '../../store/home/home.thunks'
import TotalBalance from './components/total-balance/total-balance.view'
import AccountList from './components/account-list/account-list.view'
import Spinner from '../shared/spinner/spinner.view'
import withAuthGuard from '../shared/with-auth-guard/with-auth-guard.view.jsx'
import { CurrencySymbol } from '../../utils/currencies'

function Home ({
  tokensTask,
  accountsTask,
  metaMaskWalletTask,
  fiatExchangeRatesTask,
  preferredCurrency,
  onLoadAccounts
}) {
  const classes = useHomeStyles()

  React.useEffect(() => {
    if (metaMaskWalletTask.status === 'successful') {
      onLoadAccounts(metaMaskWalletTask.data.ethereumAddress)
    }
  }, [metaMaskWalletTask, onLoadAccounts])

  function getTotalBalance (accounts) {
    if (
      tokensTask.status !== 'successful' ||
      fiatExchangeRatesTask.status !== 'successful'
    ) {
      return undefined
    }

    return accounts.reduce((amount, account) => {
      const tokenSymbol = getTokenSymbol(account.TokenID)
      const tokenRateInUSD = tokensTask.data
        .find((token) => token.Symbol === tokenSymbol).USD
      const tokenFiatRate = preferredCurrency === CurrencySymbol.USD
        ? tokenRateInUSD
        : tokenRateInUSD * fiatExchangeRatesTask.data[preferredCurrency]

      return amount + account.Balance * tokenFiatRate
    }, 0)
  }

  function getTokenSymbol (tokenId) {
    return tokensTask.data.find((token) => token.TokenID === tokenId).Symbol
  }

  return (
    <div>
      <section>
        <h4 className={classes.title}>Total balance</h4>
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
        <div className={classes.actionButtonsGroup}>
          <button className={classes.actionButton}>Send</button>
          <button className={classes.actionButton}>Add funds</button>
        </div>
      </section>
      <section>
        <h4 className={classes.title}>Accounts</h4>
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
                />
              )
            }
            default: {
              return <></>
            }
          }
        })()}
      </section>
    </div>
  )
}

Home.propTypes = {
  accountsTask: PropTypes.shape({
    status: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        Balance: PropTypes.number.isRequired,
        TokenID: PropTypes.number.isRequired
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
        TokenID: PropTypes.number.isRequired,
        Name: PropTypes.string.isRequired,
        Symbol: PropTypes.string.isRequired
      })
    ),
    error: PropTypes.string
  }),
  tokensPriceTask: PropTypes.shape({
    status: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        symbol: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired
      })
    ),
    error: PropTypes.string
  }),
  fiatExchangeRatesTask: PropTypes.shape({
    status: PropTypes.string.isRequired,
    data: PropTypes.object,
    error: PropTypes.string
  }),
  onLoadAccounts: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  tokensTask: state.global.tokensTask,
  metaMaskWalletTask: state.account.metaMaskWalletTask,
  accountsTask: state.home.accountsTask,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask,
  preferredCurrency: state.settings.preferredCurrency
})

const mapDispatchToProps = (dispatch) => ({
  onLoadAccounts: (ethereumAddress) => dispatch(fetchAccounts(ethereumAddress))
})

export default withAuthGuard(connect(mapStateToProps, mapDispatchToProps)(Home))
