import React from 'react'
import * as ethers from 'ethers'

import useFeesTableStyles from './fees-table.styles'
import TransactionInfoRow from '../../../shared/transaction-info-table-row/transaction-info-row.view'
import { MAX_TOKEN_DECIMALS } from '../../../../constants'
import { CurrencySymbol, getAmountInPreferredCurrency, getTokenAmountInPreferredCurrency } from '../../../../utils/currencies'

function FeesTable ({ l2Fee, estimatedWithdrawFee, token, preferredCurrency, fiatExchangeRates }) {
  const classes = useFeesTableStyles()

  function getL2FeeInFiat () {
    return getTokenAmountInPreferredCurrency(l2Fee, token.USD, preferredCurrency, fiatExchangeRates)
  }

  function getEstimatedWithdrawFeeInFiat () {
    if (!estimatedWithdrawFee) {
      return '--'
    }

    return getAmountInPreferredCurrency(estimatedWithdrawFee.USD, preferredCurrency, fiatExchangeRates)
  }

  function getFormattedWithdrawFee () {
    if (!estimatedWithdrawFee) {
      return undefined
    }

    return Number(ethers.utils.formatEther(estimatedWithdrawFee.amount))
  }

  if (l2Fee && estimatedWithdrawFee) {
    return (
      <div className={classes.feesTable}>
        <TransactionInfoRow
          title='Hermez fee'
          subtitle={`${CurrencySymbol[preferredCurrency].symbol}${getL2FeeInFiat().toFixed(2)}`}
          hint='Step 1'
          value={`${Number(l2Fee.toFixed(MAX_TOKEN_DECIMALS))} ${token.symbol}`}
        />
        <TransactionInfoRow
          title='Ethereum fee (estimated)'
          hint='Step 2'
          subtitle={`${CurrencySymbol[preferredCurrency].symbol}${getEstimatedWithdrawFeeInFiat().toFixed(2)}`}
          value={`${getFormattedWithdrawFee().toFixed(MAX_TOKEN_DECIMALS)} ETH`}
        />
      </div>
    )
  }

  return (
    <div className={classes.feesTable}>
      <TransactionInfoRow
        title={estimatedWithdrawFee ? 'Hermez fee' : 'Fee'}
        subtitle={`${CurrencySymbol[preferredCurrency].symbol}${getL2FeeInFiat().toFixed(2)}`}
        value={`${Number(l2Fee.toFixed(MAX_TOKEN_DECIMALS))} ${token.symbol}`}
      />
      {estimatedWithdrawFee && (
        <TransactionInfoRow
          title='Ethereum fee (estimated)'
          subtitle={`${CurrencySymbol[preferredCurrency].symbol}${getEstimatedWithdrawFeeInFiat().toFixed(2)}`}
          value={`${getFormattedWithdrawFee().toFixed(MAX_TOKEN_DECIMALS)} ETH`}
        />
      )}
    </div>
  )
}

export default FeesTable
