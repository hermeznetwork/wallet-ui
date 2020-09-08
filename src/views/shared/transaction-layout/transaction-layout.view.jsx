import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import useTransactionLayoutStyles from './transaction-layout.styles'
import Main from '../main/main.view'
import AccountList from '../account-list/account-list.view'
import Transaction from '../transaction/transaction.view'
import Spinner from '../spinner/spinner.view'

function TransactionLayout ({
  tokensTask,
  selectedToken,
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
                if (tokensTask.data.length > 0) {
                  return (
                    <AccountList
                      tokens={tokensTask.data}
                      onTokenSelected={handleAccountListClick}
                    />
                  )
                } else {
                  return (
                    <p>You don't have any ERC 20 tokens in your MetaMask account that are registered in Hermez.</p>
                  )
                }
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
  type: PropTypes.string.isRequired
}

export default TransactionLayout
