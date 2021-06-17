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

export { getFormattedEarnedReward }
