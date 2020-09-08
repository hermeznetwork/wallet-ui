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
    return tokens.find((token) => token.TokenID === tokenId).Symbol
  }

  function getTokenFiatRate (tokenSymbol) {
    if (!tokens || !fiatExchangeRates) {
      return undefined
    }

    const tokenRateInUSD = tokens
      .find((token) => token.Symbol === tokenSymbol).USD

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
        const tokenSymbol = getTokenSymbol(transaction.TokenID)
        const tokenFiatRate = getTokenFiatRate(tokenSymbol)

        return (
          <div
            key={transaction.TxID}
            className={clsx({
              [classes.transaction]: true,
              [classes.transactionSpacer]: index > 0
            })}
          >
            <Transaction
              id={transaction.TxID}
              type={transaction.Type}
              amount={transaction.Amount}
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
      TxID: PropTypes.string.isRequired,
      Type: PropTypes.string.isRequired,
      Amount: PropTypes.number.isRequired,
      TokenID: PropTypes.number.isRequired
    })
  ),
  preferredCurrency: PropTypes.string.isRequired,
  tokens: PropTypes.arrayOf(
    PropTypes.shape({
      TokenID: PropTypes.number.isRequired,
      Name: PropTypes.string.isRequired,
      Symbol: PropTypes.string.isRequired
    })
  ),
  fiatExchangeRates: PropTypes.object,
  onTransactionClick: PropTypes.func.isRequired
}

export default TransactionList
