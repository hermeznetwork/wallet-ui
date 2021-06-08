import axios from 'axios'

import { HERMEZ_AIRDROP_WEB_URL, HERMEZ_AIRDROP_ID } from '../constants'

const baseApiUrl = HERMEZ_AIRDROP_WEB_URL
const airdropID = HERMEZ_AIRDROP_ID

/**
 * Fetches Airdrop estimated reward
 * @returns {Number} - estimatedReward
 */
function getEstimatedReward (ethAddr) {
  return axios.get(`${baseApiUrl}/estimated-reward?ethAddr=${ethAddr}&airdropID=${airdropID}`)
    .then(res => res.data.estimatedReward)
}

/**
 * Fetches Airdrop earned reward
 * @returns {Number} - earnedReward
 */
function getEarnedReward (ethAddr) {
  return axios.get(`${baseApiUrl}/earned-reward?ethAddr=${ethAddr}&airdropID=${airdropID}`)
    .then(res => res.data.earnedReward)
}

export { getEstimatedReward, getEarnedReward }
