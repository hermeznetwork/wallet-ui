import React from 'react'

import useRewardsCardStyles from './rewards-card.styles'
import { CurrencySymbol, getTokenAmountInPreferredCurrency } from '../../../../utils/currencies.js'

function RewardsCard ({
  rewardTask,
  earnedRewardTask,
  rewardPercentageTask,
  tokenTask,
  preferredCurrency,
  fiatExchangeRatesTask,
  onOpenRewardsSidenav
}) {
  const classes = useRewardsCardStyles()

  function hasRewardExpired (reward) {
    const now = new Date().getTime()
    const rewardEndingTime = (reward.initTimestamp + reward.duration) * 1000

    return rewardEndingTime <= now
  }

  function getRewardAmountInPreferredCurrency (rewardAmount) {
    console.log(tokenTask)
    console.log(fiatExchangeRatesTask)
    return getTokenAmountInPreferredCurrency(
      rewardAmount,
      tokenTask.data.USD,
      preferredCurrency,
      fiatExchangeRatesTask.data
    ).toFixed(2)
  }

  if (
    rewardTask.status === 'pending' ||
    rewardTask.status === 'loading' ||
    earnedRewardTask.status === 'pending' ||
    earnedRewardTask.status === 'loading' ||
    rewardPercentageTask.status === 'pending' ||
    rewardPercentageTask.status === 'loading' ||
    tokenTask.status === 'pending' ||
    tokenTask.status === 'loading'
  ) {
    return <></>
  }

  return (
    <div className={classes.root}>
      <div className={classes.cardHeader}>
        <h3 className={classes.cardHeading}>Your earnings</h3>
        <button className={classes.moreInfoButton} onClick={onOpenRewardsSidenav}>
          More info
        </button>
      </div>
      {
        hasRewardExpired(rewardTask)
          ? (
            <>
              <p className={classes.rewardText}>
                Thank kou for participating in the Hermez reward program.
              </p>
              <p className={classes.rewardText}>
                Your total reward is {Number(earnedRewardTask.data).toFixed(2)} HEZ
              </p>
            </>
            )
          : (
            <>
              <p className={classes.rewardText}>
                Today’s reward is <span className={classes.rewardPercentage}>{Number(rewardPercentageTask.data).toFixed(2)}%</span>.
                You earned so far {earnedRewardTask.data} HEZ ({CurrencySymbol[preferredCurrency].symbol}{getRewardAmountInPreferredCurrency(earnedRewardTask.data)}).
              </p>
            </>
            )
      }
    </div>
  )
}

export default RewardsCard
