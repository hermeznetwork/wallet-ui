import { z, ZodError } from "zod";

import { StrictSchema } from "src/utils/type-safety";
import { Either } from "src/utils/types";
// adapters
import * as adapters from "src/adapters";

interface ProductionLiteral {
  REACT_APP_ENV: "production";
}

interface ProductionVars {
  REACT_APP_INFURA_API_KEY: string;
  REACT_APP_PRICE_UPDATER_API_URL: string;
  REACT_APP_PRICE_UPDATER_API_KEY: string;
  REACT_APP_WALLETCONNECT_BRIDGE: string;
}

type ProductionEnv = ProductionLiteral & ProductionVars;

interface DevelopmentLiteral {
  REACT_APP_ENV: "development";
}

type DevelopmentVars = ProductionVars & {
  REACT_APP_HERMEZ_API_URL: string;
  REACT_APP_HERMEZ_CONTRACT_ADDRESS: string;
  REACT_APP_WITHDRAWAL_DELAYER_CONTRACT_ADDRESS: string;
  REACT_APP_BATCH_EXPLORER_URL: string;
  REACT_APP_ETHERSCAN_URL: string;
};

type DevelopmentEnv = DevelopmentLiteral & DevelopmentVars;

type Env = ProductionEnv | DevelopmentEnv;

const productionLiteralParser = StrictSchema<ProductionLiteral>()(
  z.object({
    REACT_APP_ENV: z.literal("production"),
  })
);

const productionVarsParser = StrictSchema<ProductionVars>()(
  z.object({
    REACT_APP_INFURA_API_KEY: z.string(),
    REACT_APP_PRICE_UPDATER_API_URL: z.string(),
    REACT_APP_PRICE_UPDATER_API_KEY: z.string(),
    REACT_APP_WALLETCONNECT_BRIDGE: z.string(),
  })
);

const productionEnvParser = StrictSchema<ProductionEnv>()(
  productionLiteralParser.and(productionVarsParser)
);

const developmentLiteralParser = StrictSchema<DevelopmentLiteral>()(
  z.object({
    REACT_APP_ENV: z.literal("development"),
  })
);

const developmentVarsParser = StrictSchema<DevelopmentVars>()(
  productionVarsParser.and(
    z.object({
      REACT_APP_HERMEZ_API_URL: z.string(),
      REACT_APP_HERMEZ_CONTRACT_ADDRESS: z.string(),
      REACT_APP_WITHDRAWAL_DELAYER_CONTRACT_ADDRESS: z.string(),
      REACT_APP_BATCH_EXPLORER_URL: z.string(),
      REACT_APP_ETHERSCAN_URL: z.string(),
    })
  )
);

const developmentEnvParser = StrictSchema<DevelopmentEnv>()(
  developmentLiteralParser.and(developmentVarsParser)
);

export function getEnv(): Either<Env, ZodError<Env>> {
  const parsedEnvLiteral = z
    .union([productionLiteralParser, developmentLiteralParser])
    .safeParse(process.env);

  if (parsedEnvLiteral.success) {
    if (parsedEnvLiteral.data.REACT_APP_ENV === "production") {
      const parsedProductionEnv = productionEnvParser.safeParse(process.env);
      if (!parsedProductionEnv.success) {
        adapters.logDecodingError(
          parsedProductionEnv.error,
          "Could not decode the production env from the function getEnv."
        );
      }
      return parsedProductionEnv;
    } else {
      const parsedDevelopmentEnv = developmentEnvParser.safeParse(process.env);
      if (!parsedDevelopmentEnv.success) {
        adapters.logDecodingError(
          parsedDevelopmentEnv.error,
          "Could not decode the development env from the function getEnv."
        );
      }
      return parsedDevelopmentEnv;
    }
  } else {
    adapters.logDecodingError(
      parsedEnvLiteral.error,
      "Could not decode the var REACT_APP_ENV from the function getEnv."
    );
    return parsedEnvLiteral;
  }
}
