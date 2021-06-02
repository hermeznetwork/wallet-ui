import axios from 'axios'

//import { HERMEZ_WEB_URL } from '../constants'

//const baseApiUrl = HERMEZ_WEB_URL
const baseApiUrl = 'http://52.29.96.190'

/**
 * Fetches Airdrop data
 * @returns {number} - estimatedReward
 */
function getEstimatedReward (ethAddr) {
  return axios.get(`${baseApiUrl}/airdrop/v1/estimated-reward?ethAddr=${ethAddr}&airdropID=2`)
    .then(res => res.data.estimatedReward)
}

export { getEstimatedReward }
