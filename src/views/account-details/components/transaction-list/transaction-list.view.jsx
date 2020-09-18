import React from 'react'
import PropTypes from 'prop-types'

import Transaction from '../transaction/transaction.view'
import useTransactionListStyles from './transaction-list.styles'
import { CurrencySymbol } from '../../../../utils/currencies'

function TransactionList ({
  transactions,
  preferredCurrency,
  tokens,
  fiatExchangeRates,
  onTransactionClick
}) {
  const classes = useTransactionListStyles()

  function getTokenSymbol (tokenId) {
    return tokens.find((token) => token.tokenId === tokenId).symbol
  }

  function getTokenFiatRate (tokenSymbol) {
    if (!tokens || !fiatExchangeRates) {
      return undefined
    }

    const tokenRateInUSD = tokens
      .find((token) => token.symbol === tokenSymbol).USD

    return preferredCurrency === CurrencySymbol.USD.code
      ? tokenRateInUSD
      : tokenRateInUSD * fiatExchangeRates[preferredCurrency]
  }

  function handleTransactionClick (transactionId) {
    onTransactionClick(transactionId)
  }

  return (
    <>
      {transactions.map((transaction, index) => {
        const tokenSymbol = getTokenSymbol(transaction.tokenId)
        const tokenFiatRate = getTokenFiatRate(tokenSymbol)

        return (
          <div
            key={transaction.txId}
            className={classes.transaction}
          >
            <Transaction
              id={transaction.txId}
              type={transaction.type}
              amount={transaction.amount}
              tokenSymbol={tokenSymbol}
              fiatRate={tokenFiatRate}
              date={new Date().toLocaleDateString()}
              preferredCurrency={preferredCurrency}
              onClick={handleTransactionClick}
            />
          </div>
        )
      }
      )}
    </>
  )
}

TransactionList.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      txId: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      tokenId: PropTypes.number.isRequired
    })
  ),
  preferredCurrency: PropTypes.string.isRequired,
  tokens: PropTypes.arrayOf(
    PropTypes.shape({
      tokenId: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      symbol: PropTypes.string.isRequired
    })
  ),
  fiatExchangeRates: PropTypes.object,
  onTransactionClick: PropTypes.func.isRequired
}

export default TransactionList
