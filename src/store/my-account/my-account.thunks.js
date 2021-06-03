import * as myAccountActions from './my-account.actions'
import { MY_ACCOUNT } from '../../constants'
import * as airdropApi from '../../apis/airdrop'

/**
 * Changes the preferred currency of the user
 * @param {*} selectedTokenId - ISO 4217 currency code
 * @returns {void}
 */
function changePreferredCurrency (selectedTokenId) {
  return (dispatch) => {
    dispatch(myAccountActions.changePreferredCurrency(selectedTokenId))
    localStorage.setItem(MY_ACCOUNT.PREFERRED_CURRENCY_KEY, selectedTokenId)
  }
}

/**
 * Fetches Airdrop estimated reward for a given ethAddr
 * @returns {void}
 */
 function fetchEstimatedReward (ethAddr) {
  return (dispatch) => {
    dispatch(myAccountActions.loadEstimatedReward())

    return airdropApi.getEstimatedReward(ethAddr)
      .then((res) => dispatch(myAccountActions.loadEstimatedRewardSuccess(res)))
      .catch(() => dispatch(myAccountActions.loadEstimatedRewardFailure('An error occurred loading estimated reward.')))
  }
}

/**
 * Fetches Airdrop earned reward for a given ethAddr
 * @returns {void}
 */
 function fetchEarnedReward (ethAddr) {
  return (dispatch) => {
    dispatch(myAccountActions.loadEarnedReward())

    return airdropApi.getEarnedReward(ethAddr)
      .then((res) => dispatch(myAccountActions.loadEarnedRewardSuccess(res)))
      .catch(() => dispatch(myAccountActions.loadEarnedRewardFailure('An error occurred loading earned reward.')))
  }
}

export { changePreferredCurrency, fetchEstimatedReward, fetchEarnedReward }
