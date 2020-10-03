import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import clsx from 'clsx'

import { fetchAccounts } from '../../store/home/home.thunks'
import { fetchTokens, fetchMetaMaskTokens, fetchFees } from '../../store/transaction/transaction.thunks'
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
  onLoadTokens,
  onLoadMetaMaskTokens,
  onLoadAccounts,
  onLoadFees
}) {
  const classes = useTransactionStyles()
  const { tokenId } = useParams()
  const [account, setAccount] = useState()
  const [transaction, setTransaction] = useState()

  React.useEffect(() => {
    onLoadTokens()
  }, [onLoadTokens])

  React.useEffect(() => {
    if (transactionType === 'deposit' && tokensTask.status === 'successful') {
      onLoadMetaMaskTokens(tokensTask.data.tokens)
    }
  }, [transactionType, tokensTask, onLoadMetaMaskTokens])

  React.useEffect(() => {
    if (transactionType !== 'deposit' && metaMaskWalletTask.status === 'successful' && tokensTask.status === 'successful') {
      onLoadAccounts(metaMaskWalletTask.data.ethereumAddress, tokensTask.data.tokens)
    }
  }, [transactionType, metaMaskWalletTask, tokensTask, onLoadAccounts])

  React.useEffect(() => {
    onLoadFees()
  }, [onLoadFees])

  // If the prop tokenId is set, find and store the account to show the Transaction component
  if (tokenId && metaMaskTokensTask.status === 'success') {
    const selectedToken = transactionType === 'deposit'
      ? metaMaskTokensTask.data.find((account) => account.id === tokenId)
      : accountsTask.data.find((account) => account.token.id === tokenId)
    setAccount(selectedToken)
  }

  /**
   * When an account is selected, store the corresponding account to show the Transaction component
   *
   * @param {Account} account
   */
  function handleAccountListClick (account) {
    setAccount(account)
  }

  /**
   * Handler for the back button.
   * Depending on the step, unset the corresponding state to go back a step.
   */
  function handleBackButtonClick () {
    if (transaction) {
      setTransaction(undefined)
    } else if (account) {
      setAccount(undefined)
    }
  }

  /**
   * Depending on the state of the view, get the correct Header Title.
   *
   * @returns {string}
   */
  function getTitle () {
    if (account) {
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
    if (account || transaction) {
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
   * If it's a deposit, show valid account from Ethereum (Layer 1).
   * Otherwise, show account from Hermez (Layer 2).
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
                    accounts={accountsTask.data.accounts}
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
    if (account && !transaction) {
      return (
        <TransactionForm
          account={account}
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
          metaMaskWallet={metaMaskWalletTask.status === 'successful' ? metaMaskWalletTask.data : {}}
          type={transactionType}
          preferredCurrency={preferredCurrency}
          fiatExchangeRates={fiatExchangeRatesTask.status === 'successful' ? fiatExchangeRatesTask.data : {}}
          account={account}
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
  metaMaskWalletTask: PropTypes.object,
  metaMaskTokensTask: PropTypes.object,
  accountsTask: PropTypes.object,
  tokensTask: PropTypes.object,
  feesTask: PropTypes.object,
  preferredCurrency: PropTypes.string.isRequired,
  fiatExchangeRatesTask: PropTypes.object.isRequired,
  transactionType: PropTypes.string.isRequired
}

const mapStateToProps = (state) => ({
  metaMaskWalletTask: state.account.metaMaskWalletTask,
  metaMaskTokensTask: state.transaction.metaMaskTokensTask,
  accountsTask: state.home.accountsTask,
  tokensTask: state.transaction.tokensTask,
  feesTask: state.transaction.feesTask,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask,
  preferredCurrency: state.settings.preferredCurrency
})

const mapDispatchToProps = (dispatch) => ({
  onLoadTokens: () => dispatch(fetchTokens()),
  onLoadMetaMaskTokens: (hermezTokens) => dispatch(fetchMetaMaskTokens(hermezTokens)),
  onLoadAccounts: (ethereumAddress, tokens) =>
    dispatch(fetchAccounts(ethereumAddress, tokens)),
  onLoadFees: () => dispatch(fetchFees())
})

export default withAuthGuard(connect(mapStateToProps, mapDispatchToProps)(Transaction))
