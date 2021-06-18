/**
 * Formats the earned reward of an account
 * @param {String} earnedReward - Earned reward for an account
 * @returns - Formatted earned reward
 */
function getFormattedEarnedReward (earnedReward) {
  const earnedRewardNumber = Number(earnedReward)

  if (earnedRewardNumber > 0 && earnedRewardNumber < 0.01) {
    return '< 0.01'
  } else {
    return earnedRewardNumber.toFixed(2)
  }
}

/**
 * Checks if a reward has started or not
 * @param {Object} reward - Reward information
 * @returns - Flag indicating if the reward has started or not
 */
function hasRewardStarted (reward) {
  const initRewardTime = reward.initTimestamp * 1000
  const currentTime = Date.now()

  return initRewardTime <= currentTime
}

export { getFormattedEarnedReward, hasRewardStarted }
