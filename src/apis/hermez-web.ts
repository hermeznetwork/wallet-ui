import axios from "axios";

import { HERMEZ_WEB_URL } from "src/constants";

const baseApiUrl = HERMEZ_WEB_URL;

/**
 * Fetches the status of the Hermez network
 * @returns {Promise<Number>} - Network status of the Hermez Network
 */
function getNetworkStatus(): Promise<number> {
  return axios
    .get(`${baseApiUrl}/network-status.json`)
    .then((res) => res.data.isWalletUnderMaintenance);
}

export { getNetworkStatus };
