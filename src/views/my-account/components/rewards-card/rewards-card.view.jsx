import React from 'react'

import useRewardsCardStyles from './rewards-card.styles'
import { CurrencySymbol, getTokenAmountInPreferredCurrency } from '../../../../utils/currencies.js'

function RewardsCard ({
  rewardTask,
  earnedRewardTask,
  rewardPercentageTask,
  accountEligibilityTask,
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
    tokenTask.status === 'loading' ||
    accountEligibilityTask.status === 'pending' ||
    accountEligibilityTask.status === 'loading'
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
        hasRewardExpired(rewardTask.data)
          ? (
            <>
              <p className={classes.rewardText}>
                Thank kou for participating in the Hermez reward program.
              </p>
              <p className={classes.rewardText}>
                Your total reward is {Number(earnedRewardTask.data).toFixed(2)} HEZ ({CurrencySymbol[preferredCurrency].symbol}{getRewardAmountInPreferredCurrency(earnedRewardTask.data)})
              </p>
            </>
            )
          : (
            <>
              <p className={classes.rewardText}>
                Today’s reward is <span className={classes.rewardPercentage}>{rewardPercentageTask.data}%</span>.&nbsp;
                {
                  accountEligibilityTask.data
                    ? (
                      <span>You earned so far {earnedRewardTask.data} HEZ ({CurrencySymbol[preferredCurrency].symbol}{getRewardAmountInPreferredCurrency(earnedRewardTask.data)}).</span>
                      )
                    : (
                      <span>You earned so far 0.00 HEZ ({CurrencySymbol[preferredCurrency].symbol}0.00).</span>
                      )
                }
              </p>
            </>
            )
      }
    </div>
  )
}

export default RewardsCard
