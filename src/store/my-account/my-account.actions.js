export const myAccountActionTypes = {
  CHANGE_PREFERRED_CURRENCY: '[MY ACCOUNT] CHANGE DEFAULT CURRENCY',
  LOAD_ESTIMATED_REWARD: '[MY ACCOUNT] LOAD ESTIMATED REWARD',
  LOAD_ESTIMATED_REWARD_SUCCESS: '[MY ACCOUNT] LOAD ESTIMATED REWARD SUCCESS',
  LOAD_ESTIMATED_REWARD_FAILURE: '[MY ACCOUNT] LOAD ESTIMATED REWARD FAILURE',
  LOAD_EARNED_REWARD: '[MY ACCOUNT] LOAD EARNED REWARD',
  LOAD_EARNED_REWARD_SUCCESS: '[MY ACCOUNT] LOAD EARNED REWARD SUCCESS',
  LOAD_EARNED_REWARD_FAILURE: '[MY ACCOUNT] LOAD EARNED REWARD FAILURE',
}

function changePreferredCurrency (preferredCurrency) {
  return {
    type: myAccountActionTypes.CHANGE_PREFERRED_CURRENCY,
    preferredCurrency
  }
}

function loadEstimatedReward () {
  return {
    type: myAccountActionTypes.LOAD_ESTIMATED_REWARD
  }
}

function loadEstimatedRewardSuccess (data) {
  return {
    type: myAccountActionTypes.LOAD_ESTIMATED_REWARD_SUCCESS,
    data
  }
}

function loadEstimatedRewardFailure (error) {
  return {
    type: myAccountActionTypes.LOAD_ESTIMATED_REWARD_FAILURE,
    error
  }
}

function loadEarnedReward () {
  return {
    type: myAccountActionTypes.LOAD_EARNED_REWARD
  }
}

function loadEarnedRewardSuccess (data) {
  return {
    type: myAccountActionTypes.LOAD_EARNED_REWARD_SUCCESS,
    data
  }
}

function loadEarnedRewardFailure (error) {
  return {
    type: myAccountActionTypes.LOAD_EARNED_REWARD_FAILURE,
    error
  }
}

export { 
  changePreferredCurrency,
  loadEstimatedReward,
  loadEstimatedRewardSuccess,
  loadEstimatedRewardFailure,
  loadEarnedReward,
  loadEarnedRewardSuccess,
  loadEarnedRewardFailure
}
