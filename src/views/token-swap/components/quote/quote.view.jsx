import React from 'react'

import useQuoteStyles from './quote.styles'
import { ReactComponent as SushiSmLogo } from '../../../../images/exchange-logos/sushi-sm.svg'
import { getFixedTokenAmount } from '../../../../utils/currencies'

function Quote ({ id, info, toToken, amountToToken, selectedQuote, onSelect }) {
  const classes = useQuoteStyles()

  return (
    <label className={classes.root}>
      <div className={classes.bottomRow}>
        <div className={classes.nameCell}>
          <input type='radio' checked={id === selectedQuote.lpId} onChange={onSelect} />
          <SushiSmLogo className={classes.logo} />
          <p className={classes.name}>{info.name}</p>
        </div>
        <div className={classes.toTokenAmountCell}>
          <p className={classes.toTokenAmount}>
            {getFixedTokenAmount(amountToToken, toToken.token.decimals)}
          </p>
          <p className={classes.toTokenAmountDiff}>+0.002</p>
        </div>
        <div className={classes.rewardCell}>
          {info.rewards
            ? (
              <>
                <p className={classes.reward}>
                  {getFixedTokenAmount(info.rewards[0].amount, toToken.token.decimals)} {info.rewards[0].token}
                </p>
                <p className={classes.rewardHelperText}>per swap</p>
              </>
              )
            : <p className={classes.rewardHelperText}>No reward</p>}
        </div>
      </div>
    </label>
  )
}

export default Quote
