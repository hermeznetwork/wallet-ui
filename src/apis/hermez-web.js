import axios from 'axios'

import { HERMEZ_WEB_URL } from '../constants'

const baseApiUrl = HERMEZ_WEB_URL

/**
 * Fetches the status of the Hermez network
 * @returns {number} - Network status of the Hermez Network
 */
function getNetworkStatus (symbols) {
  return axios.get(`${baseApiUrl}/network-status.json`)
    .then(res => res.data.isWalletUnderMaintenance)
}

export { getNetworkStatus }
