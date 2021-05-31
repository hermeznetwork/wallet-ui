import React from 'react'
import { TxType } from '@hermeznetwork/hermezjs/src/enums'
import * as ethers from 'ethers'

import useFeeStyles from './fee.styles'
import { MAX_TOKEN_DECIMALS } from '../../../../constants'
import { CurrencySymbol, getAmountInPreferredCurrency, getTokenAmountInPreferredCurrency } from '../../../../utils/currencies'
import { ReactComponent as AngleDownIcon } from '../../../../images/icons/angle-down.svg'
import TransactionInfoRow from '../../../shared/transaction-info-table-row/transaction-info-row.view'

function Fee ({
  transactionType,
  l2Fee,
  estimatedWithdrawFee,
  token,
  preferredCurrency,
  fiatExchangeRates
}) {
  const [isWithdrawFeeExpanded, setIsWithdrawFeeExpanded] = React.useState(false)
  const classes = useFeeStyles({ isWithdrawFeeExpanded })

  function getL2FeeInFiat () {
    return getTokenAmountInPreferredCurrency(l2Fee, token.USD, preferredCurrency, fiatExchangeRates)
  }

  function getEstimatedWithdrawFeeInFiat () {
    if (!estimatedWithdrawFee) {
      return undefined
    }

    return getAmountInPreferredCurrency(estimatedWithdrawFee.USD, preferredCurrency, fiatExchangeRates)
  }

  function getFormattedWithdrawFee () {
    if (!estimatedWithdrawFee) {
      return undefined
    }

    return Number(ethers.utils.formatEther(estimatedWithdrawFee.amount))
  }

  function getTotalEstimatedWithdrawFee () {
    const l2FeeInFiat = getL2FeeInFiat()
    const estimatedWithdrawFeeInFiat = getEstimatedWithdrawFeeInFiat()

    if (!estimatedWithdrawFee) {
      return '--'
    }

    return (l2FeeInFiat + estimatedWithdrawFeeInFiat).toFixed(2)
  }

  function handleWithdrawFeeExpansion () {
    setIsWithdrawFeeExpanded(!isWithdrawFeeExpanded)
  }

  if (
    transactionType === TxType.Transfer ||
    transactionType === TxType.TransferToBJJ ||
    transactionType === TxType.TransferToEthAddr
  ) {
    return (
      <div className={classes.feeWrapper}>
        <p className={classes.fee}>
          Fee {`${Number(l2Fee.toFixed(MAX_TOKEN_DECIMALS))} ${token.symbol}`}
        </p>
      </div>
    )
  }

  if (transactionType === TxType.Exit) {
    return (
      <div className={classes.withdrawFeeWrapper}>
        <button className={classes.withdrawFeeButton} onClick={handleWithdrawFeeExpansion}>
          <p className={classes.withdrawFeeButtonText}>
            Total estimated fee {CurrencySymbol[preferredCurrency].symbol}{getTotalEstimatedWithdrawFee()}
          </p>
          <AngleDownIcon className={`${classes.withdrawFeeButtonIcon} ${classes.withdrawFeeButtonIconPath}`} />
        </button>
        {isWithdrawFeeExpanded && (
          <div className={classes.witthdrawFeeTable}>
            <TransactionInfoRow
              title='Hermez fee'
              subtitle={`${CurrencySymbol[preferredCurrency].symbol}${getL2FeeInFiat().toFixed(2)}`}
              value={`${Number(l2Fee.toFixed(MAX_TOKEN_DECIMALS))} ${token.symbol}`}
            />
            <TransactionInfoRow
              title='Ethereum fee (estimated)'
              subtitle={`${CurrencySymbol[preferredCurrency].symbol}${getEstimatedWithdrawFeeInFiat().toFixed(2)}`}
              value={`${getFormattedWithdrawFee().toFixed(MAX_TOKEN_DECIMALS)} ETH`}
            />
          </div>
        )}
      </div>
    )
  }

  return <></>
}

export default Fee
