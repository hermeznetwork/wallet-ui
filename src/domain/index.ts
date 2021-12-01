import { BigNumber } from "@ethersproject/bignumber";

import { AppAction } from "src/store";
import { HermezAccount, Token } from "src/domain/hermez";

/**
 * This namespace contains the abstract definition of the types that are used across the application.
 * These types should correspond to real entities of the domain of the application. Special care must
 * be taken on the decision of what constitutes a domain entity, as these types will determine the general
 * discourse of the code of the whole application. Think of it as the glossary of the application.
 */

export type ISOStringDate = string;

// ToDo: Header
// The types below are required to keep the state of the headers of the pages. They don't belong to the domain.
// We'll keep them in here until we migrate the views to typescript.
interface PageHeader {
  type: "page";
  data: {
    title: string;
    goBackAction?: AppAction;
    closeAction?: AppAction;
  };
}

export type Header =
  | {
      type: undefined;
    }
  | {
      type: "main";
    }
  | PageHeader;

export interface EstimatedL1Fee {
  amount: BigNumber;
  token: Token;
}

export type TransactionReceiver =
  | Pick<HermezAccount, "bjj">
  | Pick<HermezAccount, "hezEthereumAddress">;
