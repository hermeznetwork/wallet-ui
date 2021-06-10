import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import useLayoutStyles from './layout.styles'
import MainHeader from '../main-header/main-header.view'
import Main from '../main/main.view'
import PageHeader from '../page-header/page-header.view'
import Snackbar from '../snackbar/snackbar.view'
import { closeSnackbar } from '../../../store/global/global.actions'
import { FEATURE_TOGGLES } from '../../../constants'
import RewardsSidenav from '../../shared/rewards-sidenav/rewards-sidenav.view'
import * as globalThunks from '../../../store/global/global.thunks'
import * as globalActions from '../../../store/global/global.actions'

function Layout ({
  header,
  snackbar,
  rewards,
  tokenTask,
  children,
  onGoBack,
  onClose,
  onCloseSnackbar,
  onLoadEstimatedReward,
  onLoadEarnedReward,
  onLoadRewardPercentage,
  onLoadRewardAccountEligibility,
  onLoadToken,
  onCloseRewardsSidenav,
  preferredCurrency,
  fiatExchangeRatesTask
}) {
  const classes = useLayoutStyles()

  return (
    <div className={classes.root}>
      {header.type === 'main' && <MainHeader />}
      {header.type === 'page' && (
        <PageHeader
          title={header.data.title}
          subtitle={header.data.subtitle}
          goBackAction={header.data.goBackAction}
          closeAction={header.data.closeAction}
          onGoBack={onGoBack}
          onClose={onClose}
        />
      )}
      <Main>
        {children}
      </Main>
      {snackbar.status === 'open' && (
        <Snackbar
          message={snackbar.message}
          backgroundColor={snackbar.backgroundColor}
          onClose={onCloseSnackbar}
        />
      )}
      {FEATURE_TOGGLES.REWARDS_SIDENAV && rewards.sidenav.status === 'open' && (
        <RewardsSidenav
          estimatedRewardTask={rewards.estimatedRewardTask}
          earnedRewardTask={rewards.earnedRewardTask}
          rewardPercentageTask={rewards.rewardPercentageTask}
          accountEligibilityTask={rewards.accountEligibilityTask}
          tokenTask={tokenTask}
          preferredCurrency={preferredCurrency}
          fiatExchangeRatesTask={fiatExchangeRatesTask}
          onLoadEstimatedReward={onLoadEstimatedReward}
          onLoadEarnedReward={onLoadEarnedReward}
          onLoadRewardPercentage={onLoadRewardPercentage}
          onLoadRewardAccountEligibility={onLoadRewardAccountEligibility}
          onLoadToken={onLoadToken}
          onClose={onCloseRewardsSidenav}
        />
      )}
    </div>
  )
}

Layout.propTypes = {
  header: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  header: state.global.header,
  snackbar: state.global.snackbar,
  rewards: state.global.rewards,
  tokenTask: state.global.tokenTask,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask,
  preferredCurrency: state.myAccount.preferredCurrency
})

const mapDispatchToProps = (dispatch) => ({
  onCloseSnackbar: () => dispatch(closeSnackbar()),
  onLoadEstimatedReward: () =>
    dispatch(globalThunks.fetchEstimatedReward()),
  onLoadEarnedReward: () =>
    dispatch(globalThunks.fetchEarnedReward()),
  onLoadRewardPercentage: () =>
    dispatch(globalThunks.fetchRewardPercentage()),
  onLoadRewardAccountEligibility: () =>
    dispatch(globalThunks.fetchRewardAccountEligibility()),
  onLoadToken: () =>
    dispatch(globalThunks.fetchToken(1)),
  onCloseRewardsSidenav: () =>
    dispatch(globalActions.closeRewardsSidenav()),
  onGoBack: (action) => dispatch(action),
  onClose: (action) => dispatch(action)
})

export default connect(mapStateToProps, mapDispatchToProps)(Layout)
