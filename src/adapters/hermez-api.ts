import { AxiosError } from "axios";
import { z } from "zod";
import { CallOverrides, BigNumber } from "ethers";
import {
  Account,
  CoordinatorAPI,
  HermezCompressedAmount,
  Tx,
  TxFees,
  TxPool,
  TxUtils,
} from "@hermeznetwork/hermezjs";

import { convertTokenAmountToFiat } from "src/utils/currencies";
import { HttpStatusCode } from "src/utils/http";
import { StrictSchema } from "src/utils/type-safety";
import { AsyncTask } from "src/utils/types";
import { logDecodingError } from "src/adapters";
import * as parsers from "src/adapters/parsers";
// domain
import {
  AccountAuthorization,
  Accounts,
  CoordinatorState,
  Exit,
  Exits,
  FiatExchangeRates,
  HermezAccount,
  HermezAccounts,
  HermezWallet,
  HistoryTransaction,
  HistoryTransactions,
  PaginationOrder,
  PendingDeposit,
  PoolTransaction,
  Signers,
  Token,
  Tokens,
} from "src/domain";

////////////////////
// CoordinatorAPI //
////////////////////

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
  return CoordinatorAPI.postCreateAccountAuthorization(
    hermezEthereumAddress,
    publicKeyBase64,
    signature,
    nextForgerUrls
  ).catch((error: AxiosError) => {
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
            ? "Sorry, hardware wallets are not supported in Polygon Hermez yet"
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

export function getCreateAccountAuthorization(
  hezEthereumAddress: string,
  axiosConfig?: Record<string, unknown>
): Promise<AccountAuthorization> {
  return CoordinatorAPI.getCreateAccountAuthorization(hezEthereumAddress, axiosConfig).then(
    (accountAuthorization: unknown) => {
      const parsedAuthSignatures = parsers.accountAuthorization.safeParse(accountAuthorization);
      if (parsedAuthSignatures.success) {
        return parsedAuthSignatures.data;
      } else {
        throw parsedAuthSignatures.error;
      }
    }
  );
}

export function getState(
  axiosConfig?: Record<string, unknown>,
  apiUrl?: string
): Promise<CoordinatorState> {
  return CoordinatorAPI.getState(axiosConfig, apiUrl).then((coordinatorState: unknown) => {
    const parsedCoordinatorState = parsers.coordinatorState.safeParse(coordinatorState);
    if (parsedCoordinatorState.success) {
      return parsedCoordinatorState.data;
    } else {
      logDecodingError(
        parsedCoordinatorState.error,
        "Could not decode the CoordinatorState from the function getState."
      );
      throw parsedCoordinatorState.error;
    }
  });
}

export function getHistoryTransaction(
  transactionId: string,
  axiosConfig?: Record<string, unknown>
): Promise<HistoryTransaction> {
  return CoordinatorAPI.getHistoryTransaction(transactionId, axiosConfig).then(
    (historyTransaction: unknown) => {
      const parsedHistoryTransaction = parsers.historyTransaction.safeParse(historyTransaction);
      if (parsedHistoryTransaction.success) {
        return parsedHistoryTransaction.data;
      } else {
        logDecodingError(
          parsedHistoryTransaction.error,
          "Could not decode the HistoryTransaction from the function getHistoryTransaction."
        );
        throw parsedHistoryTransaction.error;
      }
    }
  );
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
  ).then((historyTransactions: unknown) => {
    const parsedUnknownHistoryTransactions =
      parsers.unknownHistoryTransactions.safeParse(historyTransactions);
    if (parsedUnknownHistoryTransactions.success) {
      return {
        pendingItems: parsedUnknownHistoryTransactions.data.pendingItems,
        transactions: parsedUnknownHistoryTransactions.data.transactions.reduce(
          (acc: HistoryTransaction[], curr: unknown, index: number) => {
            const parsedHistoryTransaction = parsers.historyTransaction.safeParse(curr);
            if (parsedHistoryTransaction.success) {
              return [...acc, parsedHistoryTransaction.data];
            } else {
              logDecodingError(
                parsedHistoryTransaction.error,
                `Could not decode the HistoryTransaction at index ${index} from the function getHistoryTransactions. It has been ignored.`
              );
              return acc;
            }
          },
          []
        ),
      };
    } else {
      logDecodingError(
        parsedUnknownHistoryTransactions.error,
        "Could not decode the resource HistoryTransactions from the function getHistoryTransactions. Can't show any data."
      );
      throw parsedUnknownHistoryTransactions.error;
    }
  });
}

export function getPoolTransaction(
  transactionId: string,
  axiosConfig?: Record<string, unknown>
): Promise<PoolTransaction> {
  return CoordinatorAPI.getPoolTransaction(transactionId, axiosConfig).then(
    (poolTransaction: unknown) => {
      const parsedPoolTransaction = parsers.poolTransaction.safeParse(poolTransaction);
      if (parsedPoolTransaction.success) {
        return parsedPoolTransaction.data;
      } else {
        logDecodingError(
          parsedPoolTransaction.error,
          "Could not decode the PoolTransaction from the function getPoolTransaction."
        );
        throw parsedPoolTransaction.error;
      }
    }
  );
}

export function getExit(
  batchNum: number,
  accountIndex: string,
  axiosConfig?: Record<string, unknown>
): Promise<Exit> {
  return CoordinatorAPI.getExit(batchNum, accountIndex, axiosConfig).then((exit: unknown) => {
    const parsedExit = parsers.exit.safeParse(exit);
    if (parsedExit.success) {
      return parsedExit.data;
    } else {
      logDecodingError(parsedExit.error, "Could not decode the Exit from the function getExit.");
      throw parsedExit.error;
    }
  });
}

export function getExits(
  address: string,
  onlyPendingWithdraws: boolean,
  tokenId?: number,
  fromItem?: number
): Promise<Exits> {
  return CoordinatorAPI.getExits(address, onlyPendingWithdraws, tokenId, fromItem).then(
    (exits: unknown) => {
      const parsedUnknownExits = parsers.unknownExits.safeParse(exits);
      if (parsedUnknownExits.success) {
        return {
          pendingItems: parsedUnknownExits.data.pendingItems,
          exits: parsedUnknownExits.data.exits.reduce(
            (acc: Exit[], curr: unknown, index: number) => {
              const parsedExit = parsers.exit.safeParse(curr);
              if (parsedExit.success) {
                return [...acc, parsedExit.data];
              } else {
                logDecodingError(
                  parsedExit.error,
                  `Could not decode the Exit at index ${index} from the function getExits. It has been ignored.`
                );
                return acc;
              }
            },
            []
          ),
        };
      } else {
        logDecodingError(
          parsedUnknownExits.error,
          "Could not decode the resource Exits from the function getExits. Can't show any data."
        );
        throw parsedUnknownExits.error;
      }
    }
  );
}

export function getTokens(
  tokenIds?: number[],
  tokenSymbols?: string[],
  fromItem?: number,
  order?: PaginationOrder,
  limit?: number,
  axiosConfig?: Record<string, unknown>
): Promise<Tokens> {
  return CoordinatorAPI.getTokens(tokenIds, tokenSymbols, fromItem, order, limit, axiosConfig);
}

export function getAccounts(
  address: string,
  tokenIds?: number[],
  fromItem?: number,
  order?: PaginationOrder,
  limit?: number,
  axiosConfig?: Record<string, unknown>
): Promise<Accounts> {
  return CoordinatorAPI.getAccounts(address, tokenIds, fromItem, order, limit, axiosConfig);
}

// Account helpers

export function getAccountBalance(
  account: HermezAccount,
  poolTransactions?: PoolTransaction[],
  pendingDeposits?: PendingDeposit[]
): string {
  let totalBalance = BigNumber.from(account.balance);

  if (pendingDeposits !== undefined && pendingDeposits.length) {
    const pendingAccountDeposits = pendingDeposits.filter(
      (deposit) => deposit.accountIndex === account.accountIndex
    );
    pendingAccountDeposits.forEach((pendingDeposit) => {
      totalBalance = totalBalance.add(BigNumber.from(pendingDeposit.amount));
    });
  }

  if (poolTransactions !== undefined && poolTransactions.length) {
    const accountPoolTransactions = poolTransactions.filter(
      (transaction) =>
        transaction.fromAccountIndex === account.accountIndex && !transaction.errorCode
    );

    accountPoolTransactions.forEach((pendingTransaction) => {
      totalBalance = totalBalance.sub(BigNumber.from(pendingTransaction.amount));
      totalBalance = totalBalance.sub(
        BigNumber.from(
          TxUtils.getFeeValue(Number(pendingTransaction.fee), pendingTransaction.amount)
        )
      );
    });
  }

  return totalBalance.toString();
}

function setAccountToken(
  tokensPrice: AsyncTask<Token[], string>,
  account: HermezAccount
): HermezAccount {
  if (tokensPrice.status === "successful" || tokensPrice.status === "reloading") {
    const token: Token | undefined = tokensPrice.data.find(
      (token) => token.id === account.token.id
    );
    return token === undefined ? account : { ...account, token };
  } else {
    return account;
  }
}

function createAccount(
  account: HermezAccount,
  tokensPriceTask: AsyncTask<Token[], string>,
  preferredCurrency: string,
  poolTransactions?: PoolTransaction[],
  fiatExchangeRates?: FiatExchangeRates,
  pendingDeposits?: PendingDeposit[]
): HermezAccount {
  const updatedAccount: HermezAccount = setAccountToken(tokensPriceTask, account);
  const accountBalance = getAccountBalance(updatedAccount, poolTransactions, pendingDeposits);
  const fiatBalance = convertTokenAmountToFiat(
    accountBalance,
    updatedAccount.token,
    preferredCurrency,
    fiatExchangeRates
  );

  return {
    ...updatedAccount,
    balance: accountBalance,
    fiatBalance,
  };
}

export function getHermezAccounts({
  hermezEthereumAddress,
  tokenIds,
  fromItem,
  order,
  limit,
  axiosConfig,
  tokensPriceTask,
  poolTransactions,
  fiatExchangeRates,
  preferredCurrency,
  pendingDeposits,
}: {
  hermezEthereumAddress: string;
  tokenIds?: number[];
  fromItem?: number;
  order?: CoordinatorAPI.PaginationOrder;
  limit?: number;
  axiosConfig?: Record<string, unknown>;
  tokensPriceTask: AsyncTask<Token[], string>;
  preferredCurrency: string;
  poolTransactions: PoolTransaction[];
  fiatExchangeRates: FiatExchangeRates;
  pendingDeposits?: PendingDeposit[];
}): Promise<HermezAccounts> {
  return getAccounts(hermezEthereumAddress, tokenIds, fromItem, order, limit, axiosConfig).then(
    (accountsResponse) => ({
      pendingItems: accountsResponse.pendingItems,
      accounts: accountsResponse.accounts.map((account) =>
        createAccount(
          account,
          tokensPriceTask,
          preferredCurrency,
          poolTransactions,
          fiatExchangeRates,
          pendingDeposits
        )
      ),
    })
  );
}

/**
 * Fetches a raw hermez Account for an accountIndex.
 */
export function getAccount(accountIndex: string): Promise<Account> {
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
  return getAccount(accountIndex).then((account) =>
    createAccount(account, tokensPriceTask, preferredCurrency, poolTransactions, fiatExchangeRates)
  );
}

////////////
// TxPool //
////////////

export function getPoolTransactions(
  accountIndex: string | undefined,
  publicKeyCompressedHex: string
): Promise<PoolTransaction[]> {
  return TxPool.getPoolTransactions(accountIndex, publicKeyCompressedHex);
}

////////
// Tx //
////////

export function deposit(
  amount: HermezCompressedAmount,
  hezEthereumAddress: string,
  token: Token,
  babyJubJub: string,
  signerData: Signers.SignerData,
  providerUrl?: string,
  gasLimit?: number,
  gasMultiplier?: number
): Promise<Tx.TxData> {
  return Tx.deposit(
    HermezCompressedAmount.compressAmount(amount.toString()),
    hezEthereumAddress,
    token,
    babyJubJub,
    signerData,
    providerUrl,
    gasLimit,
    gasMultiplier
  );
}

export function generateAndSendL2Tx(
  tx: Tx.Tx,
  wallet: HermezWallet.HermezWallet,
  token: Token,
  nextForgers: string[],
  addToTxPool?: boolean
): Promise<Tx.SendL2TransactionResponse> {
  return Tx.generateAndSendL2Tx(tx, wallet, token, nextForgers, addToTxPool);
}

export function forceExit(
  amount: HermezCompressedAmount,
  accountIndex: string,
  token: Token,
  signerData: Signers.SignerData
): Promise<Tx.TxData> {
  return Tx.forceExit(
    HermezCompressedAmount.compressAmount(amount.toString()),
    accountIndex,
    token,
    signerData
  );
}

export function withdrawCircuit(
  exit: Exit,
  isInstant: boolean,
  wasmFilePath: string,
  zkeyFilePath: string,
  signerData: Signers.SignerData
): Promise<Tx.TxData> {
  return Tx.withdrawCircuit(exit, isInstant, wasmFilePath, zkeyFilePath, signerData);
}

export function delayedWithdraw(
  hezEthereumAddress: string,
  token: Token,
  signerData: Signers.SignerData
): Promise<Tx.TxData> {
  return Tx.delayedWithdraw(hezEthereumAddress, token, signerData);
}

////////////
// TxFees //
////////////

export function estimateWithdrawCircuitGasLimit(
  token: Token,
  amount: BigNumber,
  overrides: CallOverrides,
  isInstant: boolean,
  signerData?: Signers.SignerData,
  providerUrl?: string
): Promise<number> {
  return TxFees.estimateWithdrawCircuitGasLimit(
    token,
    amount,
    overrides,
    isInstant,
    signerData,
    providerUrl
  );
}
