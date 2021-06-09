import React from 'react'

import useRewardsCardStyles from './rewards-card.styles'

function RewardsCard ({ estimatedRewardTask, earnedRewardTask, rewardPercentageTask, onOpenRewardsSidenav }) {
  const classes = useRewardsCardStyles()

  if (
    estimatedRewardTask.status === 'pending' ||
    estimatedRewardTask.status === 'loading' ||
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
        estimatedRewardTask.status === 'failed'
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
                Today’s reward is <span className={classes.rewardPercentage}>{rewardPercentageTask.data}%</span> so you can receive {estimatedRewardTask.data} HEZ
              </p>
              <p className={classes.rewardText}>
                You earned so far {earnedRewardTask.data} HEZ
              </p>
            </>
            )
      }
    </div>
  )
}

export default RewardsCard
