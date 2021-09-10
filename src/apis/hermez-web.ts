import axios from "axios";
import Ajv, { JTDSchemaType } from "ajv/dist/jtd";

import { HERMEZ_WEB_URL } from "src/constants";

const baseApiUrl = HERMEZ_WEB_URL;

const ajv = new Ajv();

interface WalletUnderMaintenanceResponse {
  isWalletUnderMaintenance: number;
}

const walletUnderMaintenanceResponseSchema: JTDSchemaType<WalletUnderMaintenanceResponse> = {
  properties: {
    isWalletUnderMaintenance: { type: "int32" },
  },
  additionalProperties: true,
};

const isWalletUnderMaintenanceResponseValidator = ajv.compile(walletUnderMaintenanceResponseSchema);

/**
 * Fetches the status of the Hermez network
 * @returns {Promise<Number>} - Network status of the Hermez Network
 */
function getNetworkStatus(): Promise<number> {
  return axios.get(`${baseApiUrl}/network-status.json`).then((res) => {
    if (isWalletUnderMaintenanceResponseValidator(res.data)) {
      return res.data.isWalletUnderMaintenance;
    } else {
      return Promise.reject(isWalletUnderMaintenanceResponseValidator.errors);
    }
  });
}

export { getNetworkStatus };
