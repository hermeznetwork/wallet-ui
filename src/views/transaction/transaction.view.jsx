import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link, useParams } from 'react-router-dom'

import { fetchMetaMaskTokens, fetchFees } from '../../store/transaction/transaction.thunks'
import useTransactionLayoutStyles from './transaction.styles'
import TransactionForm from './components/transaction-form/transaction-form.view'
import TransactionOverview from './components/transaction-overview/transaction-overview.view'
import withAuthGuard from '../shared/with-auth-guard/with-auth-guard.view'
import AccountList from '../shared/account-list/account-list.view'
import Spinner from '../shared/spinner/spinner.view'
import Container from '../shared/container/container.view'
import backIcon from '../../images/icons/back.svg'
import closeIcon from '../../images/icons/close.svg'

function Transaction ({
  metaMaskWalletTask,
  metaMaskTokensTask,
  feesTask,
  preferredCurrency,
  fiatExchangeRatesTask,
  transactionType,
  onLoadMetaMaskTokens,
  onLoadFees
}) {
  const classes = useTransactionLayoutStyles()
  const { tokenId } = useParams()
  const [token, setToken] = useState()
  const [transaction, setTransaction] = useState()

  React.useEffect(() => {
    onLoadMetaMaskTokens()
  }, [onLoadMetaMaskTokens])

  React.useEffect(() => {
    onLoadFees()
  }, [onLoadFees])

  // If the prop tokenId is set, find and store the token to show the Transaction component
  if (tokenId && metaMaskTokensTask.status === 'success') {
    const selectedToken = metaMaskTokensTask.data.find((token) => token.Id === tokenId)
    setToken(selectedToken)
  }

  /**
   * When an account is selected, store the corresponding token to show the Transaction component
   *
   * @param {Token} token
   */
  function handleAccountListClick (token) {
    setToken(token)
  }

  /**
   * Handler for the back button.
   * Depending on the step, unset the corresponding state to go back a step.
   */
  function handleBackButtonClick () {
    if (token) {
      setToken(undefined)
    } else if (transaction) {
      setTransaction(undefined)
    }
  }

  /**
   * If the view is in a step that's not the AccountList, render the back button element.
   *
   * @returns {ReactElement} The back button element
   */
  function renderBackButton () {
    if (token || transaction) {
      return (
        <button className={classes.backButton} onClick={handleBackButtonClick}>
          <img
            className={classes.backButtonIcon}
            src={backIcon}
            alt='Back Icon'
          />
        </button>
      )
    } else {
      return <></>
    }
  }

  function handleSubmit (tx) {
    console.log(tx)
    setTransaction(tx)
  }

  /**
   * Render the correct step:
   * 1. AccountList
   * 2. TransactionForm
   * 3. TransactionOverview
   * 4. TransactionConfirmation
   *
   * @returns {ReactElement} The correct component depending on the step the user is on
   */
  function renderContent () {
    if (token && !transaction) {
      return (
        <TransactionForm
          account={token}
          type={transactionType}
          preferredCurrency={preferredCurrency}
          fiatExchangeRates={fiatExchangeRatesTask.status === 'successful' ? fiatExchangeRatesTask.data : {}}
          fees={feesTask.status === 'successful' ? feesTask.data : {}}
          onSubmit={handleSubmit}
        />
      )
    } else if (transaction) {
      return (
        <TransactionOverview
          type={transactionType}
          preferredCurrency={preferredCurrency}
          fiatExchangeRates={fiatExchangeRatesTask.status === 'successful' ? fiatExchangeRatesTask.data : {}}
          token={token.token}
          from={metaMaskWalletTask.data.ethereumAddress}
          to={transaction.to}
          amount={transaction.amount}
          fee={transaction.fee}
        />
      )
    } else {
      return (
        <div>
          {(() => {
            switch (metaMaskTokensTask.status) {
              case 'loading': {
                return <Spinner />
              }
              case 'failed': {
                return (
                  <p>{metaMaskTokensTask.error}</p>
                )
              }
              case 'successful': {
                return (
                  <AccountList
                    accounts={metaMaskTokensTask.data}
                    preferredCurrency={preferredCurrency}
                    fiatExchangeRates={fiatExchangeRatesTask.status === 'successful' ? fiatExchangeRatesTask.data : {}}
                    onAccountClick={handleAccountListClick}
                  />
                )
              }
              default: {
                return <></>
              }
            }
          })()}
        </div>
      )
    }
  }

  return (
    <Container disableTopGutter>
      <section className={classes.wrapper}>
        <header className={classes.header}>
          {renderBackButton()}
          <h2 className={classes.heading}>{token ? 'Amount' : 'Token'}</h2>
          <Link to='/' className={classes.closeButtonLink}>
            <img
              className={classes.closeButton}
              src={closeIcon}
              alt='Close Transaction Icon'
            />
          </Link>
        </header>
        {renderContent()}
      </section>
    </Container>
  )
}

Transaction.propTypes = {
  metaMaskWalletTask: PropTypes.shape({
    status: PropTypes.string.isRequired,
    data: PropTypes.object,
    error: PropTypes.string
  }),
  metaMaskTokensTask: PropTypes.shape({
    status: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        balance: PropTypes.number.isRequired,
        token: PropTypes.shape({
          tokenId: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
          symbol: PropTypes.string.isRequired,
          decimals: PropTypes.number.isRequired,
          ethAddr: PropTypes.string.isRequired,
          ethBlockNum: PropTypes.number.isRequired,
          USD: PropTypes.number.isRequired
        })
      })
    )
  }),
  feesTask: PropTypes.shape({
    status: PropTypes.string.isRequired,
    data: PropTypes.shape({
      existingAccount: PropTypes.number.isRequired,
      createAccount: PropTypes.number.isRequired,
      createAccountInternal: PropTypes.number.isRequired
    })
  }),
  preferredCurrency: PropTypes.string.isRequired,
  fiatExchangeRatesTask: PropTypes.object.isRequired,
  transactionType: PropTypes.string.isRequired
}

const mapStateToProps = (state) => ({
  metaMaskWalletTask: state.account.metaMaskWalletTask,
  metaMaskTokensTask: state.transaction.metaMaskTokensTask,
  feesTask: state.transaction.feesTask,
  preferredCurrency: state.settings.preferredCurrency,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask
})

const mapDispatchToProps = (dispatch) => ({
  onLoadMetaMaskTokens: () => dispatch(fetchMetaMaskTokens()),
  onLoadFees: () => dispatch(fetchFees())
})

export default withAuthGuard(connect(mapStateToProps, mapDispatchToProps)(Transaction))
