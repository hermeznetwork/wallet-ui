import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { useTheme } from 'react-jss'
import { push } from 'connected-react-router'

import useHomeStyles from './home.styles'
import { fetchAccounts } from '../../store/home/home.thunks'
import TotalBalance from './components/total-balance/total-balance.view'
import AccountList from './components/account-list/account-list.view'
import Spinner from '../shared/spinner/spinner.view'
import withAuthGuard from '../shared/with-auth-guard/with-auth-guard.view.jsx'
import { CurrencySymbol } from '../../utils/currencies'
import Container from '../shared/container/container.view'
import sendIcon from '../../images/icons/send.svg'
import depositIcon from '../../images/icons/deposit.svg'
import { copyToClipboard } from '../../utils/dom'

function Home ({
  tokensTask,
  accountsTask,
  metaMaskWalletTask,
  fiatExchangeRatesTask,
  preferredCurrency,
  onLoadAccounts,
  onNavigateToAccountDetails
}) {
  const theme = useTheme()
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

  function handleAccountClick (account) {
    onNavigateToAccountDetails(account.tokenId)
  }

  function handleEthereumAddressClick (ethereumAddress) {
    if (metaMaskWalletTask.status === 'successful') {
      copyToClipboard(`hez:${metaMaskWalletTask.data.ethereumAddress}`)
    }
  }

  return (
    <div className={classes.root}>
      <Container backgroundColor={theme.palette.primary.main} disableTopGutter>
        <section className={classes.section}>
          <div
            className={classes.hermezAddress}
            onClick={handleEthereumAddressClick}
          >
            <p>
              {
                metaMaskWalletTask.status === 'successful'
                  ? `hez:${metaMaskWalletTask.data.ethereumAddress}`
                  : '-'
              }
            </p>
          </div>
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
          <div className={classes.actionButtonsGroup}>
            <Link to='/transfer' className={classes.button}>
              <img src={sendIcon} alt='Send' />
              <p className={classes.buttonText}>Send</p>
            </Link>
            <Link to='/deposit' className={classes.button}>
              <img src={depositIcon} alt='Deposit' />
              <p className={classes.buttonText}>Deposit</p>
            </Link>
          </div>
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
  onLoadAccounts: (ethereumAddress) => dispatch(fetchAccounts(ethereumAddress)),
  onNavigateToAccountDetails: (tokenId) =>
    dispatch(push(`/accounts/${tokenId}`))
})

export default withAuthGuard(connect(mapStateToProps, mapDispatchToProps)(Home))
