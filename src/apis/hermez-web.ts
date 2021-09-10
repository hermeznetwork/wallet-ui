import axios from "axios";
import Ajv, { JTDSchemaType } from "ajv/dist/jtd";

import { HERMEZ_WEB_URL } from "src/constants";

const baseApiUrl = HERMEZ_WEB_URL;

const ajv = new Ajv();

interface WalletUnderMaintenance {
  isWalletUnderMaintenance: number;
}

const walletUnderMaintenanceSchema: JTDSchemaType<WalletUnderMaintenance> = {
  properties: {
    isWalletUnderMaintenance: { type: "int32" },
  },
};

const isWalletUnderMaintenanceValidator = ajv.compile(walletUnderMaintenanceSchema);

/**
 * Fetches the status of the Hermez network
 * @returns {Promise<Number>} - Network status of the Hermez Network
 */
function getNetworkStatus(): Promise<number> {
  return axios.get(`${baseApiUrl}/network-status.json`).then((res: unknown) => {
    if (isWalletUnderMaintenanceValidator(res)) {
      return res.isWalletUnderMaintenance;
    } else {
      return Promise.reject(isWalletUnderMaintenanceValidator.errors);
    }
  });
}

export { getNetworkStatus };
