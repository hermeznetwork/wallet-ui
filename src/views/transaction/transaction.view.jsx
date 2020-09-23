import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import clsx from 'clsx'

import { fetchAccounts } from '../../store/home/home.thunks'
import { fetchMetaMaskTokens, fetchFees } from '../../store/transaction/transaction.thunks'
import useTransactionStyles from './transaction.styles'
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
  accountsTask,
  tokensTask,
  feesTask,
  preferredCurrency,
  fiatExchangeRatesTask,
  transactionType,
  onLoadMetaMaskTokens,
  onLoadAccounts,
  onLoadFees
}) {
  const classes = useTransactionStyles()
  const { tokenId } = useParams()
  const [token, setToken] = useState()
  const [transaction, setTransaction] = useState()

  React.useEffect(() => {
    if (transactionType === 'deposit') {
      onLoadMetaMaskTokens()
    }
  }, [transactionType, onLoadMetaMaskTokens])

  React.useEffect(() => {
    if (transactionType !== 'deposit' && metaMaskWalletTask.status === 'successful' && tokensTask.status === 'successful') {
      onLoadAccounts(metaMaskWalletTask.data.ethereumAddress, tokensTask.data)
    }
  }, [transactionType, metaMaskWalletTask, tokensTask, onLoadAccounts])

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
   * Depending on the state of the view, get the correct Header Title.
   *
   * @returns {string}
   */
  function getTitle () {
    if (token) {
      if (transaction) {
        switch (transactionType) {
          case 'deposit':
            return 'Deposit'
          case 'transfer':
            return 'Send'
          case 'withdraw':
            return 'Withdraw'
          default:
            return ''
        }
      } else {
        return 'Amount'
      }
    } else {
      return 'Token'
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

  /**
   * If it's a deposit, show valid token accounts from Ethereum (Layer 1).
   * Otherwise, show token accounts from Hermez (Layer 2).
   */
  function renderAccountList () {
    if (transactionType === 'deposit') {
      return (
        <div className={classes.accountListWrapper}>
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
    } else {
      return (
        <div className={classes.accountListWrapper}>
          {(() => {
            switch (accountsTask.status) {
              case 'loading': {
                return <Spinner />
              }
              case 'failed': {
                return (
                  <p>{accountsTask.error}</p>
                )
              }
              case 'successful': {
                return (
                  <AccountList
                    accounts={accountsTask.data}
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

  /**
   * Prepares the transaction object and stores it.
   * That then displays the <TransactionOverview> component.
   *
   * @param {Objec} tx
   */
  function handleSubmit (tx) {
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
          token={token?.token}
          from={metaMaskWalletTask.data.ethereumAddress}
          to={transaction.to}
          amount={transaction.amount}
          fee={transaction.fee}
        />
      )
    } else {
      return renderAccountList()
    }
  }

  return (
    <section className={classes.wrapper}>
      <header className={clsx({
        [classes.header]: true,
        [classes.headerPage]: !!transaction
      })}
      >
        <Container disableVerticalGutters>
          <div className={classes.headerContent}>
            {renderBackButton()}
            <h2 className={classes.heading}>{getTitle()}</h2>
            <Link to='/' className={classes.closeButtonLink}>
              <img
                className={classes.closeButton}
                src={closeIcon}
                alt='Close Transaction Icon'
              />
            </Link>
          </div>
        </Container>
      </header>
      <Container disableVerticalGutters>
        {renderContent()}
      </Container>
    </section>
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
  tokensTask: state.global.tokensTask,
  metaMaskWalletTask: state.account.metaMaskWalletTask,
  accountsTask: state.home.accountsTask,
  metaMaskTokensTask: state.transaction.metaMaskTokensTask,
  feesTask: state.transaction.feesTask,
  preferredCurrency: state.settings.preferredCurrency,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask
})

const mapDispatchToProps = (dispatch) => ({
  onLoadMetaMaskTokens: () => dispatch(fetchMetaMaskTokens()),
  onLoadAccounts: (ethereumAddress, tokens) =>
    dispatch(fetchAccounts(ethereumAddress, tokens)),
  onLoadFees: () => dispatch(fetchFees())
})

export default withAuthGuard(connect(mapStateToProps, mapDispatchToProps)(Transaction))
