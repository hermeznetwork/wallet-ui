import { BigNumber } from "@ethersproject/bignumber";

import { HermezAccount, Token } from "src/domain/hermez";

/**
 * This namespace contains the abstract definition of the types that are used across the application.
 * These types should correspond to real entities of the domain of the application. Special care must
 * be taken on the decision of what constitutes a domain entity, as these types will determine the general
 * discourse of the code of the whole application. Think of it as the glossary of the application.
 */

export type ISOStringDate = string;

export interface EstimatedL1Fee {
  amount: BigNumber;
  token: Token;
}

export type TransactionReceiver =
  | Pick<HermezAccount, "bjj">
  | Pick<HermezAccount, "hezEthereumAddress">;
