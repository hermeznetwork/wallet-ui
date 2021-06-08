import axios from 'axios'

import { HERMEZ_AIRDROP_WEB_URL, HERMEZ_AIRDROP_ID } from '../constants'

/**
 * Fetches Airdrop estimated reward
 * @returns {Number} - estimatedReward
 */
function getEstimatedReward (ethAddr) {
  return axios.get(`${HERMEZ_AIRDROP_WEB_URL}/estimated-reward?ethAddr=${ethAddr}&airdropID=${HERMEZ_AIRDROP_ID}`)
    .then(res => res.data.estimatedReward)
}

/**
 * Fetches Airdrop earned reward
 * @returns {Number} - earnedReward
 */
function getEarnedReward (ethAddr) {
  return axios.get(`${HERMEZ_AIRDROP_WEB_URL}/earned-reward?ethAddr=${ethAddr}&airdropID=${HERMEZ_AIRDROP_ID}`)
    .then(res => res.data.earnedReward)
}

export { getEstimatedReward, getEarnedReward }
