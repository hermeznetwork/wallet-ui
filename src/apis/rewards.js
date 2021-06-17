import axios from 'axios'

const baseApiUrl = `${process.env.REACT_APP_AIRDROP_API_URL}/airdrop/v1`
const airdropId = process.env.REACT_APP_AIRDROP_ID

/**
 * Fetches Airdrop data
 * @returns {Object} - airdrop
 */
function getReward (ethAddr) {
  return axios.get(`${baseApiUrl}/airdrops/${airdropId}`)
    .then(res => res.data.airdrop)
}

/**
 * Fetches Airdrop earned reward
 * @returns {String} - earnedReward
 */
function getEarnedReward (ethAddr) {
  const params = { airdropID: airdropId, ethAddr }

  return axios.get(`${baseApiUrl}/earned-reward`, { params })
    .then(res => res.data.earnedReward)
}

/**
 * Fetches Airdrop reward percentage
 * @returns {String} - rewardPercentage
 */
function getRewardPercentage () {
  const params = { airdropID: airdropId }

  return axios.get(`${baseApiUrl}/reward-percentage`, { params })
    .then(res => res.data.percentage)
}

/**
 * Checks if an Ethereum address is eligible for the reward
 * @returns {Boolean} - isUserEligible
 */
function getAccountEligibility (ethAddr) {
  const params = { ethAddr, airdropID: airdropId }

  return axios.get(`${baseApiUrl}/check-user-eligibility`, { params })
    .then(res => res.data.isUserEligible)
}

export {
  getReward,
  getEarnedReward,
  getRewardPercentage,
  getAccountEligibility
}
