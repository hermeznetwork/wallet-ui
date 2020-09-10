import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import useTransactionLayoutStyles from './transaction-layout.styles'
import Main from '../main/main.view'
import AccountList from '../account-list/account-list.view'
import Transaction from '../transaction/transaction.view'
import Spinner from '../spinner/spinner.view'

function TransactionLayout ({
  tokensTask,
  selectedTokenId,
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
                    tokens={tokensTask.data}
                    onSelect={handleAccountListClick}
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
        ethBlockNum: PropTypes.number.isRequired,
        USD: PropTypes.number.isRequired
      })
    )
  }),
  selectedTokenId: PropTypes.string,
  type: PropTypes.string.isRequired
}

export default TransactionLayout
