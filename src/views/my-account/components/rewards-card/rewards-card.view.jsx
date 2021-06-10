import React from 'react'

import useRewardsCardStyles from './rewards-card.styles'

function RewardsCard ({ rewardTask, earnedRewardTask, rewardPercentageTask, onOpenRewardsSidenav }) {
  const classes = useRewardsCardStyles()

  function hasRewardExpired (reward) {
    const now = new Date().getTime()
    const rewardEndingTime = (reward.initTimestamp + reward.duration) * 1000

    return rewardEndingTime <= now
  }

  if (
    rewardTask.status === 'pending' ||
    rewardTask.status === 'loading' ||
    earnedRewardTask.status === 'pending' ||
    earnedRewardTask.status === 'loading' ||
    rewardPercentageTask.status === 'pending' ||
    rewardPercentageTask.status === 'loading'
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
                Your total reward is {earnedRewardTask.data} HEZ
              </p>
            </>
            )
          : (
            <>
              <p className={classes.rewardText}>
                Today’s reward is <span className={classes.rewardPercentage}>{rewardPercentageTask.data}%</span>. You earned so far {earnedRewardTask.data} HEZ.
              </p>
            </>
            )
      }
    </div>
  )
}

export default RewardsCard
