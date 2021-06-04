import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { AIRDROP_MORE_INFO_URL } from '../../../constants'

import useAirdropPanelStyles from './airdrop-panel.styles'
import * as globalThunks from '../../../store/global/global.thunks'
import withAuthGuard from '../with-auth-guard/with-auth-guard.view.jsx'
import { ReactComponent as ExternalLinkIcon } from '../../../images/icons/external-link.svg'
import { ReactComponent as GreenCircleWhiteThickIcon } from '../../../images/icons/green-circle-white-thick.svg'
import { ReactComponent as InfoGreyIcon } from '../../../images/icons/info-grey.svg'
import heztoken from '../../../images/heztoken.svg'

function AirdropPanel ({
  estimatedRewardTask,
  earnedRewardTask,
  onLoadEstimatedReward,
  onLoadEarnedReward,
  hermezEthereumAddress
}) {
  const classes = useAirdropPanelStyles()

  React.useEffect(() => {
    onLoadEstimatedReward(hermezEthereumAddress)
    onLoadEarnedReward(hermezEthereumAddress)
  }, [onLoadEstimatedReward, onLoadEarnedReward])

  return (
    <>
      <h3 className={classes.panelTitle}>Deposit funds to Hermez to earn rewards.</h3>
      <img
        className={classes.tokenImage}
        src={heztoken}
        alt='Hermez token'
      />
      <p className={classes.panelTimeLeft}>XXd XXh XXm left</p>
      <p className={classes.panelHighlightedText}>Eligibility criteria:</p>
      <p className={classes.eligibilityCriteriaText}>Make at least 2 transactions to other Hermez accounts.</p>
      <p className={classes.eligibileText}><GreenCircleWhiteThickIcon />You are eligible to earn rewards.</p>
      <div className={classes.rewardCard}>
        <p className={classes.panelHighlightedText}>Today’s reward</p>
        <p className={`${classes.reward} ${classes.rewardPercentage}`}>0%</p>
        <p className={classes.panelHighlightedText}>Today’s estimated reward for your funds in Hermez</p>
        <p className={classes.reward}>{estimatedRewardTask.data} HEZ</p>
        <p className={classes.panelHighlightedText}>You earned so far</p>
        <p className={classes.reward}>{earnedRewardTask.data} HEZ</p>
      </div>
      <p className={classes.rewardText}><InfoGreyIcon />You will receive your reward at the end of the program.</p>
      <a
        className={classes.moreInfo}
        href={AIRDROP_MORE_INFO_URL}
        target='_blank'
        rel='noopener noreferrer'
      >More Info <ExternalLinkIcon />
      </a>
    </>
  )
}

AirdropPanel.propTypes = {
  estimatedRewardTask: PropTypes.object.isRequired,
  earnedRewardTask: PropTypes.object.isRequired,
  onLoadEstimatedReward: PropTypes.func.isRequired,
  onLoadEarnedReward: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  estimatedRewardTask: state.global.estimatedRewardTask,
  earnedRewardTask: state.global.earnedRewardTask
})

const mapDispatchToProps = (dispatch) => ({
  onLoadEstimatedReward: (ethAddr) =>
    dispatch(globalThunks.fetchEstimatedReward(ethAddr)),
  onLoadEarnedReward: (ethAddr) =>
    dispatch(globalThunks.fetchEarnedReward(ethAddr))
})

export default withAuthGuard(connect(mapStateToProps, mapDispatchToProps)(AirdropPanel))
