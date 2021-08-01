import React from 'react'

import useQuoteStyles from './quote.styles'
import { ReactComponent as SushiSmLogo } from '../../../../images/exchange-logos/sushi-sm.svg'
import { getFixedTokenAmount } from '../../../../utils/currencies'
import { ReactComponent as BestQuoteBadge } from '../../../../images/icons/green-badge-white-tick.svg'

function Quote ({
  info,
  toToken,
  amountToToken,
  amountToTokenDiff,
  isTheBest,
  isSelected,
  onSelect,
  onShowMoreInfo
}) {
  const classes = useQuoteStyles()
  console.log(amountToTokenDiff)
  return (
    <div className={classes.root}>
      {isTheBest && (
        <div className={classes.bestQuoteContainer}>
          <BestQuoteBadge className={classes.bestQuoteBadge} />
          <p className={classes.bestQuoteText}>Best offer at this moment</p>
        </div>
      )}
      <div className={classes.quoteInfo}>
        <div className={classes.nameCell}>
          <input type='radio' checked={isSelected} onChange={onSelect} />
          <SushiSmLogo className={classes.logo} />
          <p className={classes.name}>{info.name}</p>
          <button
            className={classes.moreInfoButton}
            onClick={onShowMoreInfo}
          >
            More info
          </button>
        </div>
        <div className={classes.toTokenAmountCell}>
          <p className={classes.toTokenAmount}>
            {getFixedTokenAmount(amountToToken, toToken.token.decimals)}
          </p>
          {amountToTokenDiff.gt(0) && (
            <p className={classes.toTokenAmountDiff}>
              -{getFixedTokenAmount(amountToTokenDiff, toToken.token.decimals)}
            </p>
          )}
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
    </div>
  )
}

export default Quote
