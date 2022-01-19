import { z, ZodError } from "zod";

import { StrictSchema } from "src/utils/type-safety";
import { ZodEither } from "src/utils/types";
// adapters
import * as adapters from "src/adapters";

interface Common {
  REACT_APP_BATCH_EXPLORER_URL: string;
  REACT_APP_INFURA_API_KEY: string;
  REACT_APP_PRICE_UPDATER_API_URL: string;
  REACT_APP_PRICE_UPDATER_API_KEY: string;
  REACT_APP_WALLETCONNECT_BRIDGE: string;
}

type Production = Common & {
  REACT_APP_ENV: "production";
};

type Development = Common & {
  REACT_APP_ENV: "development";
  REACT_APP_HERMEZ_API_URL: string;
  REACT_APP_HERMEZ_CONTRACT_ADDRESS: string;
  REACT_APP_WITHDRAWAL_DELAYER_CONTRACT_ADDRESS: string;
  REACT_APP_ETHERSCAN_URL: string;
};

type Env = Production | Development;

const commonEnvParser = StrictSchema<Common>()(
  z.object({
    REACT_APP_BATCH_EXPLORER_URL: z.string(),
    REACT_APP_INFURA_API_KEY: z.string(),
    REACT_APP_PRICE_UPDATER_API_URL: z.string(),
    REACT_APP_PRICE_UPDATER_API_KEY: z.string(),
    REACT_APP_WALLETCONNECT_BRIDGE: z.string(),
  })
);

const productionEnvParser = StrictSchema<Production>()(
  commonEnvParser.and(
    z.object({
      REACT_APP_ENV: z.literal("production"),
    })
  )
);

const developmentEnvParser = StrictSchema<Development>()(
  commonEnvParser.and(
    z.object({
      REACT_APP_ENV: z.literal("development"),
      REACT_APP_HERMEZ_API_URL: z.string(),
      REACT_APP_HERMEZ_CONTRACT_ADDRESS: z.string(),
      REACT_APP_WITHDRAWAL_DELAYER_CONTRACT_ADDRESS: z.string(),
      REACT_APP_ETHERSCAN_URL: z.string(),
    })
  )
);

const envParser = z.union([productionEnvParser, developmentEnvParser]);

export function getEnv(): ZodEither<Env, ZodError<Env>> {
  const parsedEnv = envParser.safeParse(process.env);
  if (parsedEnv.success === false) {
    adapters.logDecodingError(
      parsedEnv.error,
      "Could not decode the .env from the function getEnv."
    );
  }
  return parsedEnv;
}
