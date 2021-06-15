import axios from 'axios'

import { HERMEZ_AIRDROP_WEB_URL, HERMEZ_AIRDROP_ID } from '../constants'

/**
 * Fetches Airdrop data
 * @returns {Object} - airdrop
 */
function getReward (ethAddr) {
  return axios.get(`${HERMEZ_AIRDROP_WEB_URL}/airdrops/${HERMEZ_AIRDROP_ID}`)
    .then(res => res.data.airdrop)
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
function getRewardPercentage () {
  const params = { airdropID: HERMEZ_AIRDROP_ID }

  return axios.get(`${HERMEZ_AIRDROP_WEB_URL}/reward-percentage`, { params })
    .then(res => res.data.percentage)
}

/**
 * Checks if an Ethereum address is eligible for the reward
 * @returns {Boolean} - isUserEligible
 */
function getAccountEligibility (ethAddr) {
  const params = { ethAddr, airdropID: HERMEZ_AIRDROP_ID }

  return axios.get(`${HERMEZ_AIRDROP_WEB_URL}/check-user-eligibility`, { params })
    .then(res => res.data.isUserEligible)
}

export {
  getReward,
  getEarnedReward,
  getRewardPercentage,
  getAccountEligibility
}
