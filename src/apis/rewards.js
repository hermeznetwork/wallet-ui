import axios from 'axios'

const baseApiUrl = `${process.env.REACT_APP_AIRDROP_API_URL}/airdrop/v1`
const airdropId = process.env.REACT_APP_AIRDROP_ID
const accumulatedAirdropIds = process.env.REACT_APP_ACCUMULATED_AIRDROP_IDS || ''

/**
 * Fetches Airdrop data
 * @returns {Promise<Object>} - airdrop
 */
function getReward () {
  return axios.get(`${baseApiUrl}/airdrops/${airdropId}`)
    .then(res => res.data.airdrop)
}

/**
 * Fetches Airdrop earned reward
 * @param {String} ethAddr - Ethereum address
 * @returns {String} - earnedReward
 */
function getEarnedReward (ethAddr) {
  const params = { airdropID: airdropId, ethAddr }

  return axios.get(`${baseApiUrl}/earned-reward`, { params })
    .then(res => res.data.earnedReward)
}

/**
 * Fetches earned reward for multiple Airdrops
 * @param {String} ethAddr - Ethereum address
 * @returns {Promise<String>} - accumulatedEarnedReward
 */
function getAccumulatedEarnedReward (ethAddr) {
  const params = new URLSearchParams()

  params.append('ethAddr', ethAddr)
  accumulatedAirdropIds.split(',').forEach(airdropId => params.append('airdropID', airdropId))

  return axios.get(`${baseApiUrl}/accumulated-earned-reward`, { params })
    .then(res => res.data.earnedReward)
}

/**
 * Fetches Airdrop reward percentage
 * @returns {Promise<String>} - rewardPercentage
 */
function getRewardPercentage () {
  const params = { airdropID: airdropId }

  return axios.get(`${baseApiUrl}/reward-percentage`, { params })
    .then(res => res.data.percentage)
}

/**
 * Checks if an Ethereum address is eligible for the reward
 * @param {String} ethAddr - Ethereum address
 * @returns {Promise<Boolean>} - isUserEligible
 */
function getAccountEligibility (ethAddr) {
  const params = { ethAddr, airdropID: airdropId }

  return axios.get(`${baseApiUrl}/check-user-eligibility`, { params })
    .then(res => res.data.isUserEligible)
}

export {
  getReward,
  getEarnedReward,
  getAccumulatedEarnedReward,
  getRewardPercentage,
  getAccountEligibility
}
