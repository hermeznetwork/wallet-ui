import React from 'react'
import PropTypes from 'prop-types'
import { AIRDROP_MORE_INFO_URL } from '../../../constants'

import useRewardsSidenavStyles from './rewards-sidenav.styles'
import { ReactComponent as ExternalLinkIcon } from '../../../images/icons/external-link.svg'
import { ReactComponent as GreenCircleWhiteThickIcon } from '../../../images/icons/green-circle-white-thick.svg'
import { ReactComponent as InfoGreyIcon } from '../../../images/icons/info-grey.svg'
import heztoken from '../../../images/heztoken.svg'
import Sidenav from '../sidenav/sidenav.view'
import * as date from '../../../utils/date'
import { getTokenAmountInPreferredCurrency, CurrencySymbol } from '../../../utils/currencies'

function RewardsSidenav ({
  rewardTask,
  earnedRewardTask,
  rewardPercentageTask,
  accountEligibilityTask,
  tokenTask,
  preferredCurrency,
  fiatExchangeRatesTask,
  onLoadReward,
  onLoadEarnedReward,
  onLoadRewardPercentage,
  onLoadRewardAccountEligibility,
  onLoadToken,
  onClose
}) {
  const classes = useRewardsSidenavStyles()
  const [rewardRemainingTime, setRewardRemainingTime] = React.useState(undefined)

  function getRewardAmountInPreferredCurrency (rewardAmount) {
    return getTokenAmountInPreferredCurrency(
      rewardAmount,
      tokenTask.data.USD,
      preferredCurrency,
      fiatExchangeRatesTask.data
    ).toFixed(2)
  }

  React.useEffect(() => {
    onLoadReward()
    onLoadEarnedReward()
    onLoadRewardAccountEligibility()
    onLoadRewardPercentage()
    onLoadToken()
  }, [])

  React.useEffect(() => {
    const updateTimer = () => {
      if (rewardTask.status === 'successful') {
        const rewardEndingTime = (rewardTask.data.initTimestamp + rewardTask.data.duration) * 1000
        const rewardRemaningTime = rewardEndingTime - new Date().getTime()

        if (!hasRewardExpired(rewardTask.data)) {
          setRewardRemainingTime(rewardRemaningTime)
        }
      }
    }
    const intervalId = setInterval(updateTimer, 1000)

    updateTimer()

    return () => { clearInterval(intervalId) }
  }, [rewardTask])

  function hasRewardExpired (reward) {
    const now = new Date().getTime()
    const rewardEndingTime = (reward.initTimestamp + reward.duration) * 1000

    return rewardEndingTime <= now
  }

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
            rewardTask.status === 'pending' ||
            rewardTask.status === 'loading' ||
            earnedRewardTask.status === 'pending' ||
            earnedRewardTask.status === 'loading' ||
            rewardPercentageTask.status === 'pending' ||
            rewardPercentageTask.status === 'loading' ||
            accountEligibilityTask.status === 'pending' ||
            accountEligibilityTask.status === 'loading' ||
            tokenTask.status === 'pending' ||
            tokenTask.status === 'loading'
          ) {
            return <></>
          }

          return hasRewardExpired(rewardTask.data)
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
                      {Number(earnedRewardTask.data).toFixed(2)} HEZ
                      (${getRewardAmountInPreferredCurrency(earnedRewardTask.data)})
                    </p>
                  </div>
                </div>
              </>
              )
            : (
              <>
                <p className={classes.timeLeft}>
                  {date.getTimeLeft(rewardRemainingTime)}
                </p>
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
                    <p className={`${classes.reward} ${classes.rewardPercentage}`}>{Number(rewardPercentageTask.data).toFixed(2)}%</p>
                  </div>
                  <div className={classes.rewardGroup}>
                    <p className={classes.rewardTitle}>
                      You earned so far
                    </p>
                    <p className={classes.reward}>
                      {Number(earnedRewardTask.data).toFixed(2)} HEZ
                      ({CurrencySymbol[preferredCurrency].symbol}{getRewardAmountInPreferredCurrency(earnedRewardTask.data)})
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
  rewardTask: PropTypes.object.isRequired,
  earnedRewardTask: PropTypes.object.isRequired,
  tokenTask: PropTypes.object.isRequired
}

export default RewardsSidenav
