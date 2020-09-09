import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

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

    return preferredCurrency === CurrencySymbol.USD
      ? tokenRateInUSD
      : tokenRateInUSD * fiatExchangeRates[preferredCurrency]
  }

  function handleTransactionClick (transactionId) {
    onTransactionClick(transactionId)
  }

  return (
    <div>
      {transactions.map((transaction, index) => {
        const tokenSymbol = getTokenSymbol(transaction.tokenId)
        const tokenFiatRate = getTokenFiatRate(tokenSymbol)

        return (
          <div
            key={transaction.txId}
            className={clsx({
              [classes.transaction]: true,
              [classes.transactionSpacer]: index > 0
            })}
          >
            <Transaction
              id={transaction.txId}
              type={transaction.type}
              amount={transaction.amount}
              tokenSymbol={tokenSymbol}
              fiatRate={tokenFiatRate}
              date={new Date().toLocaleString()}
              preferredCurrency={preferredCurrency}
              onClick={handleTransactionClick}
            />
          </div>
        )
      }
      )}
    </div>
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
