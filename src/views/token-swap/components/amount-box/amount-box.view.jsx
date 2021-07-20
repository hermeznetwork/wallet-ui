import React from 'react'
import useTokenSwapStyles from './amount-box.style'
import { ReactComponent as AngleDown } from '../../../../images/icons/angle-down.svg'
import FiatAmount from '../../../shared/fiat-amount/fiat-amount.view'
import AmountInput from '../../../shared/amount-input/amount-input'

function AmountBox ({
  onGoToQuotes,
  onOpenOfferSidenav,
  account,
  preferredCurrency,
  value,
  amount,
  onInputChange
}) {
  const classes = useTokenSwapStyles()
  return (
    <div className={classes.box}>
      <div className={classes.row}>
        <div className={classes.selectorBox}>
          Select token <AngleDown className={classes.angleColor} />
        </div>
        <input
          className={classes.amountInput}
          type='text'
          value={value}
          placeholder='0.00'
          onChange={onInputChange}
        />
      </div>
      <div className={`${classes.row} ${classes.rowMarginTop}`}>
        <span className={classes.convertedText}>
          Balance: {account.balance} {account.token.symbol}{' '}
          <span className={classes.maxBtn}>Max</span>
        </span>
        <span className={classes.convertedText}>
          <FiatAmount
            amount={account.fiatBalance}
            currency={preferredCurrency}
          />
        </span>
      </div>
    </div>
  )
}

export default AmountInput(AmountBox)
