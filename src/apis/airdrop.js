import axios from 'axios'

// import { HERMEZ_WEB_URL } from '../constants'

// const baseApiUrl = HERMEZ_WEB_URL

// TODO: change back proper hermez web URL
const baseApiUrl = 'http://52.29.96.190'

/**
 * Fetches Airdrop estimated reward
 * @returns {Number} - estimatedReward
 */
function getEstimatedReward (ethAddr) {
  return axios.get(`${baseApiUrl}/airdrop/v1/estimated-reward?ethAddr=${ethAddr}&airdropID=2`)// airdropID=4
    .then(res => res.data.estimatedReward)
}

/**
 * Fetches Airdrop earned reward
 * @returns {Number} - earnedReward
 */
function getEarnedReward (ethAddr) {
  return axios.get(`${baseApiUrl}/airdrop/v1/earned-reward?ethAddr=${ethAddr}&airdropID=2`)// airdropID=4
    .then(res => res.data.earnedReward)
}

export { getEstimatedReward, getEarnedReward }
