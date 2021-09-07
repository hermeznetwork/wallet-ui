import React from "react";

import { hasRewardStarted } from "../../../utils/rewards";
import MainHeader from "../main-header/main-header.view";
import PageHeader from "../page-header/page-header.view";
import RewardsSidenav from "../rewards-sidenav/rewards-sidenav.view";
import Snackbar from "../snackbar/snackbar.view";

function BaseLayout({
  header,
  snackbar,
  rewards,
  preferredCurrency,
  fiatExchangeRatesTask,
  children,
  onGoBack,
  onClose,
  onCloseSnackbar,
  onLoadEarnedReward,
  onLoadRewardPercentage,
  onLoadRewardAccountEligibility,
  onLoadToken,
  onCloseRewardsSidenav,
}) {
  return (
    <>
      {header.type === "main" && (
        <MainHeader
          showNotificationsIndicator={
            process.env.REACT_APP_ENABLE_AIRDROP === "true" && rewards.sidenav.status === "closed"
          }
        />
      )}
      {header.type === "page" && (
        <PageHeader
          title={header.data.title}
          subtitle={header.data.subtitle}
          goBackAction={header.data.goBackAction}
          closeAction={header.data.closeAction}
          onGoBack={onGoBack}
          onClose={onClose}
        />
      )}
      {children}
      {snackbar.status === "open" && (
        <Snackbar
          message={snackbar.message}
          backgroundColor={snackbar.backgroundColor}
          onClose={onCloseSnackbar}
        />
      )}
      {process.env.REACT_APP_ENABLE_AIRDROP === "true" &&
        (rewards.rewardTask.status === "successful" || rewards.rewardTask.status === "reloading") &&
        hasRewardStarted(rewards.rewardTask.data) &&
        rewards.sidenav.status === "open" && (
          <RewardsSidenav
            rewardTask={rewards.rewardTask}
            earnedRewardTask={rewards.earnedRewardTask}
            rewardPercentageTask={rewards.rewardPercentageTask}
            accountEligibilityTask={rewards.accountEligibilityTask}
            tokenTask={rewards.tokenTask}
            preferredCurrency={preferredCurrency}
            fiatExchangeRatesTask={fiatExchangeRatesTask}
            onLoadEarnedReward={onLoadEarnedReward}
            onLoadRewardPercentage={onLoadRewardPercentage}
            onLoadRewardAccountEligibility={onLoadRewardAccountEligibility}
            onLoadToken={onLoadToken}
            onClose={onCloseRewardsSidenav}
          />
        )}
    </>
  );
}

export default BaseLayout;
