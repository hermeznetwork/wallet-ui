import React from 'react'
import { TxType } from '@hermeznetwork/hermezjs/src/enums'

import useFeeStyles from './fee.styles'
import { MAX_TOKEN_DECIMALS } from '../../../../constants'
import { CurrencySymbol, getAmountInPreferredCurrency, getTokenAmountInPreferredCurrency } from '../../../../utils/currencies'
import { ReactComponent as AngleDownIcon } from '../../../../images/icons/angle-down.svg'
import FeesTable from '../fees-table/fees-table.view'
import { getRealFee } from '../../../../utils/fees'

function Fee ({
  transactionType,
  amount,
  l2Fee,
  estimatedWithdrawFee,
  token,
  preferredCurrency,
  fiatExchangeRates,
  showInFiat
}) {
  const [isWithdrawFeeExpanded, setIsWithdrawFeeExpanded] = React.useState(false)
  const classes = useFeeStyles({ isWithdrawFeeExpanded })
  const l2RealFee = getRealFee(amount, token, l2Fee)
  const l2FeeInFiat = getTokenAmountInPreferredCurrency(l2RealFee, token.USD, preferredCurrency, fiatExchangeRates)

  function getTotalEstimatedWithdrawFee () {
    if (!estimatedWithdrawFee) {
      return '--'
    }

    const estimatedWithdrawFeeInFiat = getAmountInPreferredCurrency(estimatedWithdrawFee.USD, preferredCurrency, fiatExchangeRates)

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
          Fee&nbsp;
          <span>{showInFiat ? Number(l2FeeInFiat) : Number(l2RealFee.toFixed(MAX_TOKEN_DECIMALS))} </span>
          <span>{(showInFiat) ? preferredCurrency : token.symbol}</span>
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
          <FeesTable
            l2Fee={getRealFee(amount, token, l2Fee)}
            estimatedWithdrawFee={estimatedWithdrawFee}
            token={token}
            preferredCurrency={preferredCurrency}
            fiatExchangeRates={fiatExchangeRates}
          />
        )}
      </div>
    )
  }

  return <></>
}

export default Fee
