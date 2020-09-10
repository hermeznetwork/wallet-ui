import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import useTransactionLayoutStyles from './transaction-layout.styles'
import AccountList from '../account-list/account-list.view'
import Transaction from '../transaction/transaction.view'
import Spinner from '../spinner/spinner.view'
import Main from '../main/main.view'

function TransactionLayout ({
  tokensTask,
  selectedToken,
  preferredCurrency,
  fiatExchangeRates,
  type
}) {
  const classes = useTransactionLayoutStyles()

  function handleAccountListClick () {

  }

  function renderContent () {
    if (selectedToken) {
      return (
        <Transaction
          token={selectedToken}
          type={type}
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
          <h2 className={classes.heading}>{selectedToken ? 'Amount' : 'Token'}</h2>
          <Link to='/' className={classes.closeButton}>X</Link>
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
        ethBlockNum: PropTypes.number.isRequired
      })
    )
  }),
  selectedToken: PropTypes.shape({
    balance: PropTypes.number.isRequired,
    tokenId: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
    decimals: PropTypes.number.isRequired,
    ethAddr: PropTypes.string.isRequired,
    ethBlockNum: PropTypes.number.isRequired
  }),
  type: PropTypes.string.isRequired,
  preferredCurrency: PropTypes.string.isRequired,
  fiatExchangeRates: PropTypes.object.isRequired
}

export default TransactionLayout
