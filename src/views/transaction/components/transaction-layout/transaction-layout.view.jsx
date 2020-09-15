import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import useTransactionLayoutStyles from './transaction-layout.styles'
import TransactionForm from '../transaction-form/transaction-form.view'
import AccountList from '../../../shared/account-list/account-list.view'
import Spinner from '../../../shared/spinner/spinner.view'
import Container from '../../../shared/container/container.view'
import backIcon from '../../../../images/icons/back.svg'
import closeIcon from '../../../../images/icons/close.svg'

function TransactionLayout ({
  tokensTask,
  selectedTokenId,
  preferredCurrency,
  fiatExchangeRates,
  type
}) {
  const classes = useTransactionLayoutStyles()
  const [token, setToken] = useState()

  // If the prop selectedTokenId is set, find and store the token to show the Transaction component
  if (selectedTokenId && tokensTask.status === 'success') {
    const selectedToken = tokensTask.data.find((token) => token.Id === selectedTokenId)
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
    }
  }

  /**
   * If the view is in a step that's not the AccountList, render the back button element.
   *
   * @returns {ReactElement} The back button element
   */
  function renderBackButton () {
    if (token) {
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
   * Render the correct step:
   * 1. AccountList
   * 2. Transaction
   * 3. TransactionOverview
   * 4. TransactionConfirmation
   *
   * @returns {ReactElement} The correct component depending on the step the user is on
   */
  function renderContent () {
    if (token) {
      return (
        <TransactionForm
          account={token}
          type={type}
          preferredCurrency={preferredCurrency}
          fiatExchangeRates={fiatExchangeRates}
        />
      )
    } else {
      return (
        <div>
          {(() => {
            switch (tokensTask.status) {
              case 'loading': {
                return <Spinner />
              }
              case 'failed': {
                return (
                  <p>{tokensTask.error}</p>
                )
              }
              case 'successful': {
                return (
                  <AccountList
                    accounts={tokensTask.data}
                    preferredCurrency={preferredCurrency}
                    fiatExchangeRates={fiatExchangeRates}
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

TransactionLayout.propTypes = {
  tokensTask: PropTypes.shape({
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
  selectedTokenId: PropTypes.string,
  type: PropTypes.string.isRequired,
  preferredCurrency: PropTypes.string.isRequired,
  fiatExchangeRates: PropTypes.object.isRequired
}

export default TransactionLayout
