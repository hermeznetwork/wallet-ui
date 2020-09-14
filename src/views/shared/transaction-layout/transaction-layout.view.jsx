import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import useTransactionLayoutStyles from './transaction-layout.styles'
import AccountList from '../account-list/account-list.view'
import Transaction from '../transaction/transaction.view'
import Spinner from '../spinner/spinner.view'
import Main from '../main/main.view'

function TransactionLayout ({
  tokensTask,
  selectedTokenId,
  preferredCurrency,
  fiatExchangeRates,
  type
}) {
  const classes = useTransactionLayoutStyles()
  const [token, setToken] = useState()

  if (selectedTokenId && tokensTask.status === 'success') {
    const selectedToken = tokensTask.data.find((token) => token.Id === selectedTokenId)
    setToken(selectedToken)
  }

  function handleAccountListClick (token) {
    setToken(token)
  }

  function renderContent () {
    if (token) {
      return (
        <Transaction
          token={token}
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
                    onTokenSelected={handleAccountListClick}
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
    <Main>
      <section className={classes.wrapper}>
        <header className={classes.header}>
          <h2 className={classes.heading}>{token ? 'Amount' : 'Token'}</h2>
          <Link to='/' className={classes.closeButtonLink}>
            <img
              className={classes.closeButton}
              src='/assets/icons/close.svg'
              alt='Close Transaction Icon'
            />
          </Link>
        </header>
        {renderContent()}
      </section>
    </Main>
  )
}

TransactionLayout.propTypes = {
  tokensTask: PropTypes.shape({
    status: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        balance: PropTypes.number.isRequired,
        tokenId: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        symbol: PropTypes.string.isRequired,
        decimals: PropTypes.number.isRequired,
        ethAddr: PropTypes.string.isRequired,
        ethBlockNum: PropTypes.number.isRequired,
        USD: PropTypes.number.isRequired
      })
    )
  }),
  selectedTokenId: PropTypes.string,
  type: PropTypes.string.isRequired,
  preferredCurrency: PropTypes.string.isRequired,
  fiatExchangeRates: PropTypes.object.isRequired
}

export default TransactionLayout
