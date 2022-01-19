import { z, ZodError } from "zod";

import { StrictSchema } from "src/utils/type-safety";
import { ZodEither } from "src/utils/types";
// adapters
import * as adapters from "src/adapters";

interface Env {
  NODE_ENV: string;
  PUBLIC_URL: string;
  REACT_APP_ENV: string;
  REACT_APP_BATCH_EXPLORER_URL: string;
  REACT_APP_INFURA_API_KEY: string;
  REACT_APP_PRICE_UPDATER_API_URL: string;
  REACT_APP_PRICE_UPDATER_API_KEY: string;
  REACT_APP_WALLETCONNECT_BRIDGE: string;
}

const envParser = StrictSchema<Env>()(
  z.object({
    NODE_ENV: z.string(),
    PUBLIC_URL: z.string(),
    REACT_APP_ENV: z.string(),
    REACT_APP_BATCH_EXPLORER_URL: z.string(),
    REACT_APP_INFURA_API_KEY: z.string(),
    REACT_APP_PRICE_UPDATER_API_URL: z.string(),
    REACT_APP_PRICE_UPDATER_API_KEY: z.string(),
    REACT_APP_WALLETCONNECT_BRIDGE: z.string(),
  })
);

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
