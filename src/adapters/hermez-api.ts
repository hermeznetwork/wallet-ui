import { AxiosError } from "axios";
import { z } from "zod";
import { CallOverrides, BigNumber } from "ethers";
import {
  CoordinatorAPI,
  HermezCompressedAmount,
  Tx,
  TxFees,
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
  CoordinatorState,
  Exit,
  Exits,
  FiatExchangeRates,
  HermezAccount,
  HermezAccounts,
  HermezRawAccount,
  HermezRawAccounts,
  HermezWallet,
  HistoryTransaction,
  HistoryTransactions,
  PaginationOrder,
  PendingDeposit,
  PoolTransaction,
  PoolTransactions,
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
          `An error occurred on postCreateAccountAuthorization but the server response could not be decoded: ${JSON.stringify(
            error.response
          )}`
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
          (acc: HistoryTransaction[], curr: unknown, index: number): HistoryTransaction[] => {
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
            (acc: Exit[], curr: unknown, index: number): Exit[] => {
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
  return CoordinatorAPI.getTokens(tokenIds, tokenSymbols, fromItem, order, limit, axiosConfig).then(
    (tokens: unknown) => {
      const parsedUnknownTokens = parsers.unknownTokens.safeParse(tokens);
      if (parsedUnknownTokens.success) {
        return {
          pendingItems: parsedUnknownTokens.data.pendingItems,
          tokens: parsedUnknownTokens.data.tokens.reduce(
            (acc: Token[], curr: unknown, index: number): Token[] => {
              const parsedToken = parsers.token.safeParse(curr);
              if (parsedToken.success) {
                return [...acc, parsedToken.data];
              } else {
                logDecodingError(
                  parsedToken.error,
                  `Could not decode the Token at index ${index} from the function getTokens. It has been ignored.`
                );
                return acc;
              }
            },
            []
          ),
        };
      } else {
        logDecodingError(
          parsedUnknownTokens.error,
          "Could not decode the resource Tokens from the function getTokens. Can't show any data."
        );
        throw parsedUnknownTokens.error;
      }
    }
  );
}

/**
 * Fetches the transactions in the pool for a Hermez address
 */
export function getPoolTransactions(
  hermezEthereumAddress: string,
  order?: PaginationOrder,
  limit?: number
): Promise<PoolTransactions> {
  return CoordinatorAPI.getPoolTransactions(
    hermezEthereumAddress,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    order,
    limit
  ).then((poolTransactions: unknown) => {
    const parsedUnknownPoolTransactions =
      parsers.unknownPoolTransactions.safeParse(poolTransactions);
    if (parsedUnknownPoolTransactions.success) {
      return {
        pendingItems: parsedUnknownPoolTransactions.data.pendingItems,
        transactions: parsedUnknownPoolTransactions.data.transactions.reduce(
          (acc: PoolTransaction[], curr: unknown, index: number): PoolTransaction[] => {
            const parsedPoolTransaction = parsers.poolTransaction.safeParse(curr);
            if (parsedPoolTransaction.success) {
              return [...acc, parsedPoolTransaction.data];
            } else {
              logDecodingError(
                parsedPoolTransaction.error,
                `Could not decode the PoolTransaction at index ${index} from the function getPoolTransactions. It has been ignored.`
              );
              return acc;
            }
          },
          []
        ),
      };
    } else {
      logDecodingError(
        parsedUnknownPoolTransactions.error,
        "Could not decode the list of PoolTransaction from the function getPoolTransactions. Can't show any data."
      );
      throw parsedUnknownPoolTransactions.error;
    }
  });
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

function createHermezAccount(
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

export function getHermezRawAccounts(
  address: string,
  tokenIds?: number[],
  fromItem?: number,
  order?: PaginationOrder,
  limit?: number,
  axiosConfig?: Record<string, unknown>
): Promise<HermezRawAccounts> {
  return CoordinatorAPI.getAccounts(address, tokenIds, fromItem, order, limit, axiosConfig).then(
    (hermezRawAccounts: unknown) => {
      const parsedUnknownHermezRawAccounts =
        parsers.unknownHermezRawAccounts.safeParse(hermezRawAccounts);
      if (parsedUnknownHermezRawAccounts.success) {
        return {
          pendingItems: parsedUnknownHermezRawAccounts.data.pendingItems,
          accounts: parsedUnknownHermezRawAccounts.data.accounts.reduce(
            (acc: HermezRawAccount[], curr: unknown, index: number): HermezRawAccount[] => {
              const parsedHermezRawAccount = parsers.hermezRawAccount.safeParse(curr);
              if (parsedHermezRawAccount.success) {
                return [...acc, parsedHermezRawAccount.data];
              } else {
                logDecodingError(
                  parsedHermezRawAccount.error,
                  `Could not decode the Account at index ${index} from the function getAccounts. It has been ignored.`
                );
                return acc;
              }
            },
            []
          ),
        };
      } else {
        logDecodingError(
          parsedUnknownHermezRawAccounts.error,
          "Could not decode the resource Accounts from the function getAccounts. Can't show any data."
        );
        throw parsedUnknownHermezRawAccounts.error;
      }
    }
  );
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
  return getHermezRawAccounts(
    hermezEthereumAddress,
    tokenIds,
    fromItem,
    order,
    limit,
    axiosConfig
  ).then((accountsResponse) => ({
    pendingItems: accountsResponse.pendingItems,
    accounts: accountsResponse.accounts.map((account) =>
      createHermezAccount(
        account,
        tokensPriceTask,
        preferredCurrency,
        poolTransactions,
        fiatExchangeRates,
        pendingDeposits
      )
    ),
  }));
}

/**
 * Fetches the HermezRawAccount for an accountIndex.
 */
function getHermezRawAccount(accountIndex: string): Promise<HermezRawAccount> {
  return CoordinatorAPI.getAccount(accountIndex).then((hermezRawAccount: unknown) => {
    const parsedHermezRawAccount = parsers.hermezRawAccount.safeParse(hermezRawAccount);
    if (parsedHermezRawAccount.success) {
      return parsedHermezRawAccount.data;
    } else {
      logDecodingError(
        parsedHermezRawAccount.error,
        "Could not decode the Account from the function getAccount."
      );
      throw parsedHermezRawAccount.error;
    }
  });
}

/**
 * Fetches the HermezAccount for an accountIndex.
 */
export function getHermezAccount(
  accountIndex: string,
  tokensPriceTask: AsyncTask<Token[], string>,
  preferredCurrency: string,
  fiatExchangeRates: FiatExchangeRates,
  poolTransactions?: PoolTransaction[]
): Promise<HermezAccount> {
  return getHermezRawAccount(accountIndex).then((account) =>
    createHermezAccount(
      account,
      tokensPriceTask,
      preferredCurrency,
      poolTransactions,
      fiatExchangeRates
    )
  );
}

////////
// Tx //
////////

export function generateAndSendL2Tx(
  tx: Tx.Tx,
  wallet: HermezWallet.HermezWallet,
  token: Token,
  nextForgers: string[]
): Promise<Tx.SendL2TransactionResponse> {
  return Tx.generateAndSendL2Tx(tx, wallet, token, nextForgers).then(
    (sendL2TransactionResponse: unknown) => {
      const parsedSendL2TransactionResponse =
        parsers.sendL2TransactionResponse.safeParse(sendL2TransactionResponse);
      if (parsedSendL2TransactionResponse.success) {
        return parsedSendL2TransactionResponse.data;
      } else {
        logDecodingError(
          parsedSendL2TransactionResponse.error,
          "Could not decode the SendL2TransactionResponse from the function generateAndSendL2Tx."
        );
        throw parsedSendL2TransactionResponse.error;
      }
    }
  );
}

export function deposit(
  amount: BigNumber,
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
  ).then((txData: unknown) => {
    const parsedTxData = parsers.txData.safeParse(txData);
    if (parsedTxData.success) {
      return parsedTxData.data;
    } else {
      logDecodingError(
        parsedTxData.error,
        "Could not decode the TxData from the function deposit."
      );
      throw parsedTxData.error;
    }
  });
}

export function forceExit(
  amount: BigNumber,
  accountIndex: string,
  token: Token,
  signerData: Signers.SignerData
): Promise<Tx.TxData> {
  return Tx.forceExit(
    HermezCompressedAmount.compressAmount(amount.toString()),
    accountIndex,
    token,
    signerData
  ).then((txData: unknown) => {
    const parsedTxData = parsers.txData.safeParse(txData);
    if (parsedTxData.success) {
      return parsedTxData.data;
    } else {
      logDecodingError(
        parsedTxData.error,
        "Could not decode the TxData from the function forceExit."
      );
      throw parsedTxData.error;
    }
  });
}

export function withdrawCircuit(
  exit: Exit,
  isInstant: boolean,
  wasmFilePath: string,
  zkeyFilePath: string,
  signerData: Signers.SignerData
): Promise<Tx.TxData> {
  return Tx.withdrawCircuit(exit, isInstant, wasmFilePath, zkeyFilePath, signerData).then(
    (txData: unknown) => {
      const parsedTxData = parsers.txData.safeParse(txData);
      if (parsedTxData.success) {
        return parsedTxData.data;
      } else {
        logDecodingError(
          parsedTxData.error,
          "Could not decode the TxData from the function withdrawCircuit."
        );
        throw parsedTxData.error;
      }
    }
  );
}

export function delayedWithdraw(
  hezEthereumAddress: string,
  token: Token,
  signerData: Signers.SignerData
): Promise<Tx.TxData> {
  return Tx.delayedWithdraw(hezEthereumAddress, token, signerData).then((txData: unknown) => {
    const parsedTxData = parsers.txData.safeParse(txData);
    if (parsedTxData.success) {
      return parsedTxData.data;
    } else {
      logDecodingError(
        parsedTxData.error,
        "Could not decode the TxData from the function delayedWithdraw."
      );
      throw parsedTxData.error;
    }
  });
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
  ).then((estimateWithdrawCircuitGasLimit: unknown) => {
    const parsedEstimateWithdrawCircuitGasLimit = z
      .number()
      .safeParse(estimateWithdrawCircuitGasLimit);
    if (parsedEstimateWithdrawCircuitGasLimit.success) {
      return parsedEstimateWithdrawCircuitGasLimit.data;
    } else {
      logDecodingError(
        parsedEstimateWithdrawCircuitGasLimit.error,
        "Could not decode the number from the function estimateWithdrawCircuitGasLimit."
      );
      throw parsedEstimateWithdrawCircuitGasLimit.error;
    }
  });
}
