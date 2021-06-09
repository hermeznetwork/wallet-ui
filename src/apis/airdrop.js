import axios from 'axios'

import { HERMEZ_AIRDROP_WEB_URL, HERMEZ_AIRDROP_ID } from '../constants'

/**
 * Fetches Airdrop estimated reward
 * @returns {String} - estimatedReward
 */
function getEstimatedReward (ethAddr) {
  const params = { airdropID: HERMEZ_AIRDROP_ID, ethAddr }

  return axios.get(`${HERMEZ_AIRDROP_WEB_URL}/estimated-reward`, { params })
    .then(res => res.data.estimatedReward)
}

/**
 * Fetches Airdrop earned reward
 * @returns {String} - earnedReward
 */
function getEarnedReward (ethAddr) {
  const params = { airdropID: HERMEZ_AIRDROP_ID, ethAddr }

  return axios.get(`${HERMEZ_AIRDROP_WEB_URL}/earned-reward`, { params })
    .then(res => res.data.earnedReward)
}

/**
 * Fetches Airdrop reward percentage
 * @returns {String} - rewardPercentage
 */
function getRewardPercentage (ethAddr) {
  const params = { airdropID: HERMEZ_AIRDROP_ID }

  return axios.get(`${HERMEZ_AIRDROP_WEB_URL}/reward-percentage`, { params })
    .then(res => res.data.percentage)
}

export { getEstimatedReward, getEarnedReward, getRewardPercentage }
