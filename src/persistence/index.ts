/**
 * HermezJS type definitions have been moved to the dedicated definitions file hermezjs-typings.d.ts
 * We may decide not to export them from the persistence and let other layers import them from the lib.
 */
import { AxiosError } from "axios";
import { z } from "zod";
import hermez from "@hermeznetwork/hermezjs";
import { CoordinatorAPI } from "@hermeznetwork/hermezjs";
import { getPoolTransactions } from "@hermeznetwork/hermezjs/src/tx-pool";

import { HttpStatusCode } from "src/utils/http";
import { StrictSchema } from "src/utils/type-safety";
import { createAccount } from "src/utils/accounts";
import { AsyncTask } from "src/utils/types";
// domain
import {
  Accounts,
  HermezAccount,
  Token,
  FiatExchangeRates,
  PoolTransaction,
  HermezWallet,
} from "src/domain";

export type { HistoryTransactions, Exits, Accounts } from "@hermeznetwork/hermezjs";
export interface PostCreateAccountAuthorizationError {
  message: string;
  code: number;
  type: string;
}

const postCreateAccountAuthorizationErrorParser =
  StrictSchema<PostCreateAccountAuthorizationError>()(
    z.object({
      message: z.string(),
      code: z.number(),
      type: z.string(),
    })
  );

export function postCreateAccountAuthorization(
  hermezEthereumAddress: string,
  publicKeyBase64: string,
  signature: string,
  nextForgerUrls: string[]
): Promise<unknown> {
  return hermez.CoordinatorAPI.postCreateAccountAuthorization(
    hermezEthereumAddress,
    publicKeyBase64,
    signature,
    nextForgerUrls
  ).catch((error: AxiosError<PostCreateAccountAuthorizationError>) => {
    // If the coordinators already have the CreateAccountsAuth signature,
    // we ignore the error
    const isDuplicationError = error.response?.status === HttpStatusCode.DUPLICATED;
    if (isDuplicationError === false) {
      console.log(error);
      const parsedErrorResponse = postCreateAccountAuthorizationErrorParser.safeParse(
        error.response?.data
      );
      if (parsedErrorResponse.success) {
        const errorMessage =
          parsedErrorResponse.data.code === -32603
            ? "Sorry, hardware wallets are not supported in Hermez yet"
            : error.message;
        throw new Error(errorMessage);
      } else {
        throw new Error(
          "Oops... An error occurred while creating the account authorization but I could not decode the error response from the server."
        );
      }
    }
  });
}

/**
 * Fetches the accounts to use in a transaction.
 */
export function fetchAccounts(
  wallet: HermezWallet.HermezWallet,
  tokensPriceTask: AsyncTask<Token[], string>,
  poolTransactions: PoolTransaction[],
  fiatExchangeRates: FiatExchangeRates,
  preferredCurrency: string,
  fromItem?: number
): Promise<Accounts> {
  return CoordinatorAPI.getAccounts(wallet.publicKeyBase64, undefined, fromItem).then(
    (accountsResponse) => ({
      pendingItems: accountsResponse.pendingItems,
      accounts: accountsResponse.accounts.map((account) =>
        createAccount(
          account,
          poolTransactions,
          undefined,
          tokensPriceTask,
          preferredCurrency,
          fiatExchangeRates
        )
      ),
    })
  );
}

/**
 * Fetches the account details for an accountIndex in the Hermez API.
 */
export function fetchHermezAccount(
  tokensPriceTask: AsyncTask<Token[], string>,
  accountIndex: string,
  poolTransactions: PoolTransaction[],
  fiatExchangeRates: FiatExchangeRates,
  preferredCurrency: string
): Promise<HermezAccount> {
  return CoordinatorAPI.getAccount(accountIndex).then((account) =>
    createAccount(
      account,
      poolTransactions,
      undefined,
      tokensPriceTask,
      preferredCurrency,
      fiatExchangeRates
    )
  );
}

/**
 * Fetches the transactions which are in the transactions pool
 */
export function fetchPoolTransactions(
  wallet: HermezWallet.HermezWallet,
  address?: string
): Promise<PoolTransaction[]> {
  return getPoolTransactions(address, wallet.publicKeyCompressedHex);
}

// Error decoding and message extraction
interface MessageKeyError {
  message: string;
}

const messageKeyErrorParser = StrictSchema<MessageKeyError>()(
  z.object({
    message: z.string(),
  })
);

export function getErrorMessage(error: unknown, defaultMsg?: string): string {
  if (typeof error === "string") {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  const parsedMessageKeyError = messageKeyErrorParser.safeParse(error);
  if (parsedMessageKeyError.success) {
    return parsedMessageKeyError.data.message;
  }
  if (defaultMsg !== undefined) {
    return defaultMsg;
  }
  return "An unknown error occurred";
}
