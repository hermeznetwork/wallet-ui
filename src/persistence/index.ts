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
  Exit,
  Exits,
  FiatExchangeRates,
  HermezAccount,
  HermezWallet,
  HistoryTransaction,
  HistoryTransactions,
  PaginationOrder,
  PoolTransaction,
  Token,
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
 * Fetches the HermezAccounts to use in a transaction.
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
          tokensPriceTask,
          preferredCurrency,
          poolTransactions,
          fiatExchangeRates
        )
      ),
    })
  );
}

/**
 * Fetches the raw hermez.Account for an accountIndex from the Hermez API.
 */
export function fetchRawHermezAccount(accountIndex: string): Promise<hermez.Account> {
  return CoordinatorAPI.getAccount(accountIndex);
}

/**
 * Fetches the HermezAccount for an accountIndex.
 */
export function fetchHermezAccount(
  accountIndex: string,
  tokensPriceTask: AsyncTask<Token[], string>,
  preferredCurrency: string,
  fiatExchangeRates: FiatExchangeRates,
  poolTransactions?: PoolTransaction[]
): Promise<HermezAccount> {
  return fetchRawHermezAccount(accountIndex).then((account) =>
    createAccount(account, tokensPriceTask, preferredCurrency, poolTransactions, fiatExchangeRates)
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

export function getHistoryTransaction(
  transactionId: string,
  axiosConfig?: Record<string, unknown>
): Promise<HistoryTransaction> {
  return CoordinatorAPI.getHistoryTransaction(transactionId, axiosConfig);
}

export function getHistoryTransactions(
  address?: string,
  tokenId?: number,
  batchNum?: number,
  accountIndex?: string,
  fromItem?: number,
  order?: PaginationOrder,
  limit?: number,
  axiosConfig?: Record<string, unknown>
): Promise<HistoryTransactions> {
  return CoordinatorAPI.getTransactions(
    address,
    tokenId,
    batchNum,
    accountIndex,
    fromItem,
    order,
    limit,
    axiosConfig
  );
}

export function getExit(
  batchNum: number,
  accountIndex: string,
  axiosConfig?: Record<string, unknown>
): Promise<Exit> {
  return CoordinatorAPI.getExit(batchNum, accountIndex, axiosConfig);
}

export function getExits(
  address: string,
  onlyPendingWithdraws: boolean,
  tokenId?: number,
  fromItem?: number
): Promise<Exits> {
  return CoordinatorAPI.getExits(address, onlyPendingWithdraws, tokenId, fromItem);
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
