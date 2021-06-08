import React from 'react'
import PropTypes from 'prop-types'
import { AIRDROP_MORE_INFO_URL } from '../../../constants'

import useAirdropPanelStyles from './airdrop-panel.styles'
import { ReactComponent as ExternalLinkIcon } from '../../../images/icons/external-link.svg'
import { ReactComponent as GreenCircleWhiteThickIcon } from '../../../images/icons/green-circle-white-thick.svg'
import { ReactComponent as InfoGreyIcon } from '../../../images/icons/info-grey.svg'
import heztoken from '../../../images/heztoken.svg'
import Sidenav from '../../shared/sidenav/sidenav.view'

function AirdropPanel ({  
  estimatedReward,
  earnedReward,
  onClose
}) {
  const classes = useAirdropPanelStyles()

  return (
    <Sidenav onClose={onClose}>
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
        <p className={classes.reward}>{estimatedReward} HEZ</p>
        <p className={classes.panelHighlightedText}>You earned so far</p>
        <p className={classes.reward}>{earnedReward} HEZ</p>
      </div>
      <p className={classes.rewardText}><InfoGreyIcon />You will receive your reward at the end of the program.</p>
      <a
        className={classes.moreInfo}
        href={AIRDROP_MORE_INFO_URL}
        target='_blank'
        rel='noopener noreferrer'
      >More Info <ExternalLinkIcon />
      </a>
    </Sidenav>
  )
}

AirdropPanel.propTypes = {
  estimatedReward: PropTypes.string.isRequired,
  earnedReward: PropTypes.string.isRequired
}

export default AirdropPanel
