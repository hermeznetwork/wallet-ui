import React from 'react'
import PropTypes from 'prop-types'
import { AIRDROP_MORE_INFO_URL } from '../../../constants'

import useRewardsSidenavStyles from './rewards-sidenav.styles'
import { ReactComponent as ExternalLinkIcon } from '../../../images/icons/external-link.svg'
import { ReactComponent as GreenCircleWhiteThickIcon } from '../../../images/icons/green-circle-white-thick.svg'
import { ReactComponent as InfoGreyIcon } from '../../../images/icons/info-grey.svg'
import heztoken from '../../../images/heztoken.svg'
import Sidenav from '../sidenav/sidenav.view'

function RewardsSidenav ({
  estimatedRewardTask,
  earnedRewardTask,
  rewardPercentageTask,
  accountEligibilityTask,
  onLoadEstimatedReward,
  onLoadEarnedReward,
  onLoadRewardPercentage,
  onLoadRewardAccountEligibility,
  onClose
}) {
  const classes = useRewardsSidenavStyles()

  React.useEffect(() => {
    onLoadEstimatedReward()
    onLoadEarnedReward()
    onLoadRewardAccountEligibility()
    onLoadRewardPercentage()
  }, [])

  return (
    <Sidenav onClose={onClose}>
      <div className={classes.root}>
        <h3 className={classes.panelTitle}>Deposit funds to Hermez to earn rewards.</h3>
        <img
          className={classes.tokenImage}
          src={heztoken}
          alt='Hermez token'
        />
        {(() => {
          if (
            estimatedRewardTask.status === 'pending' ||
            estimatedRewardTask.status === 'loading' ||
            earnedRewardTask.status === 'pending' ||
            earnedRewardTask.status === 'loading' ||
            rewardPercentageTask.status === 'pending' ||
            rewardPercentageTask.status === 'loading' ||
            accountEligibilityTask.status === 'pending' ||
            accountEligibilityTask.status === 'loading'
          ) {
            return <></>
          }

          return estimatedRewardTask.status === 'failed'
            ? (
              <>
                <p className={classes.finishedText}>
                  Thank you for participating in the Hermez reward program. You will receive your HEZ in next few days.
                </p>
                <div className={classes.rewardCard}>
                  <div className={classes.rewardGroup}>
                    <p className={classes.rewardTitle}>
                      Your total reward
                    </p>
                    <p className={classes.reward}>
                      {earnedRewardTask.data} HEZ
                    </p>
                  </div>
                </div>
              </>
              )
            : (
              <>
                <p className={classes.timeLeft}>XXd XXh XXm left</p>
                {
                  accountEligibilityTask.data
                    ? (
                      <div className={classes.eligibleTextWrapper}>
                        <GreenCircleWhiteThickIcon className={classes.eligibleIcon} />
                        <p className={classes.eligibleText}>
                          You are eligible to earn rewards.
                        </p>
                      </div>
                      )
                    : (
                      <>
                        <p className={classes.eligibilityCriteriaTitle}>Eligibility criteria:</p>
                        <p className={classes.eligibilityCriteriaText}>Make at least 2 transactions to other Hermez accounts.</p>
                      </>
                      )
                }
                <div className={classes.rewardCard}>
                  <div className={classes.rewardGroup}>
                    <p className={classes.rewardTitle}>Today’s reward</p>
                    <p className={`${classes.reward} ${classes.rewardPercentage}`}>{rewardPercentageTask.data}%</p>
                  </div>
                  <div className={classes.rewardGroup}>
                    <p className={classes.rewardTitle}>Today’s estimated reward for your funds in Hermez</p>
                    <p className={classes.reward}>{estimatedRewardTask.data} HEZ</p>
                  </div>
                  <div className={classes.rewardGroup}>
                    <p className={classes.rewardTitle}>
                      You earned so far
                    </p>
                    <p className={classes.reward}>
                      {earnedRewardTask.data} HEZ
                    </p>
                  </div>
                </div>
                {
                  accountEligibilityTask.data && (
                    <div className={classes.infoTextWrapper}>
                      <InfoGreyIcon className={classes.infoIcon} />
                      <p className={classes.infoText}>
                        You will receive your reward at the end of the program.
                      </p>
                    </div>
                  )
                }
                <a
                  className={classes.moreInfoLink}
                  href={AIRDROP_MORE_INFO_URL}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  More Info <ExternalLinkIcon className={classes.moreInfoLinkIcon} />
                </a>
              </>
              )
        })()}
      </div>
    </Sidenav>
  )
}

RewardsSidenav.propTypes = {
  estimatedRewardTask: PropTypes.object.isRequired,
  earnedRewardTask: PropTypes.object.isRequired
}

export default RewardsSidenav
