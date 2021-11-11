import { BigNumber } from "ethers";
import { HermezCompressedAmount } from "@hermeznetwork/hermezjs";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";
import { parseUnits } from "ethers/lib/utils";
import { getMaxAmountFromMinimumFee } from "@hermeznetwork/hermezjs/src/tx-utils";

import { getDepositFee } from "src/utils/fees";
// domain
import {
  CoordinatorState,
  Exit,
  HistoryTransaction,
  ISOStringDate,
  PendingDelayedWithdraw,
  Token,
} from "src/domain/hermez";

/**
 * Returns the correct amount for a transaction from the Hermez API depending on its type
 */
function getTransactionAmount(transaction: HistoryTransaction): string | undefined {
  // ToDo: This check and the undefined return should be removed once all views are migrated to TS
  if (!transaction) {
    return undefined;
  }

  return (transaction.type === TxType.Deposit ||
    transaction.type === TxType.CreateAccountDeposit) &&
    transaction.L1Info
    ? transaction.L1Info.depositAmount
    : transaction.amount;
}

/**
 * Calculates an estimated time until the transaction will be forged
 * If it's an L1 transaction, it adds the forgeDelay again
 */
function getTxPendingTime(
  // ToDo: This undefined and the check below can be removed once the views are migrated to TS
  coordinatorState: CoordinatorState | undefined,
  isL1: boolean,
  timestamp: ISOStringDate
): number {
  if (!coordinatorState) {
    return 0;
  }
  const timeToForge = coordinatorState.node.forgeDelay;
  const lastBatchForgedInSeconds = Date.parse(coordinatorState.network.lastBatch.timestamp) / 1000;
  const whenToForgeInSeconds = timeToForge + lastBatchForgedInSeconds;
  const nowInSeconds = Date.now() / 1000;
  const timestampInSeconds = Date.parse(timestamp) / 1000;
  const timeLeftToForgeInSeconds =
    whenToForgeInSeconds -
    nowInSeconds +
    (isL1 && timestampInSeconds > lastBatchForgedInSeconds ? timeToForge : 0);
  const timeLeftToForgeInMinutes = Math.round(timeLeftToForgeInSeconds / 60);
  return timeLeftToForgeInMinutes > 0 ? timeLeftToForgeInMinutes : 0;
}

/**
 * Delayed Withdraws, once they are in the WithdrawalDelayer smart contract,
 * are merged by token. We need to manually merge them to show the correct
 * information to the user.
 */
function mergeDelayedWithdraws(
  pendingDelayedWithdraws: PendingDelayedWithdraw[]
): PendingDelayedWithdraw[] {
  return pendingDelayedWithdraws.reduce(
    (
      mergedPendingDelayedWithdraws: PendingDelayedWithdraw[],
      pendingDelayedWithdraw: PendingDelayedWithdraw
    ) => {
      const existingPendingDelayedWithdrawWithToken = mergedPendingDelayedWithdraws.find(
        (delayedWithdraw) => delayedWithdraw.token.id === pendingDelayedWithdraw.token.id
      );

      return existingPendingDelayedWithdrawWithToken === undefined
        ? [...mergedPendingDelayedWithdraws, pendingDelayedWithdraw]
        : mergedPendingDelayedWithdraws.map((mergedPendingDelayedWithdraw) => {
            return mergedPendingDelayedWithdraw === existingPendingDelayedWithdrawWithToken
              ? {
                  ...mergedPendingDelayedWithdraw,
                  // We need to sum up the balances and use the latest timestamp for the timer
                  balance: BigNumber.from(mergedPendingDelayedWithdraw.balance)
                    .add(BigNumber.from(pendingDelayedWithdraw.balance))
                    .toString(),
                  timestamp:
                    Date.parse(mergedPendingDelayedWithdraw.timestamp) >
                    Date.parse(pendingDelayedWithdraw.timestamp)
                      ? mergedPendingDelayedWithdraw.timestamp
                      : pendingDelayedWithdraw.timestamp,
                }
              : mergedPendingDelayedWithdraw;
          });
    },
    []
  );
}

/**
 * Helper function that merges both Exits and Delayed Withdraws
 */
function mergeExits(exits: Exit[], pendingDelayedWithdraws: PendingDelayedWithdraw[]): Exit[] {
  // Remove Exits that are now pending Delayed Withdraws
  const nonDelayedExits = exits.filter((exit) => {
    const exitId = `${exit.accountIndex}${exit.batchNum}`;
    return !pendingDelayedWithdraws.find(
      (pendingDelayedWithdraw) => pendingDelayedWithdraw.id === exitId
    );
  });

  // Merge pending Delayed Withdraws that share the same token id
  const mergedDelayedExits = mergeDelayedWithdraws(pendingDelayedWithdraws);

  return [...mergedDelayedExits, ...nonDelayedExits];
}

/**
 * Checks whether an amount is supported by the compression
 * used in the Hermez network
 */
function isTransactionAmountCompressedValid(amount: BigNumber): boolean {
  try {
    const compressedAmount = HermezCompressedAmount.compressAmount(amount.toString());
    const decompressedAmount = HermezCompressedAmount.decompressAmount(compressedAmount);

    return amount.toString() === decompressedAmount.toString();
  } catch (e) {
    return false;
  }
}

/**
 * Fixes the transaction amount to be sure that it would be supported by Hermez
 */
function fixTransactionAmount(amount: BigNumber): BigNumber {
  const fixedTxAmount = HermezCompressedAmount.decompressAmount(
    HermezCompressedAmount.floorCompressAmount(amount.toString())
  );

  return BigNumber.from(fixedTxAmount);
}

/**
 * Calculates the max amoumt that can be sent in a transaction
 * @param {TxType} txType - Transaction type
 * @param {BigNumber} maxAmount - Max amount that can be sent in a transaction (usually it's an account balance)
 * @param {Object} token - Token object
 * @param {Number} l2Fee - Transaction fee
 * @param {BigNumber} gasPrice - Ethereum gas price
 * @returns maxTxAmount
 */
function getMaxTxAmount(
  txType: TxType,
  maxAmount: BigNumber,
  token: Token,
  l2Fee: number,
  gasPrice: BigNumber
): BigNumber {
  const maxTxAmount = (() => {
    switch (txType) {
      case TxType.ForceExit: {
        return maxAmount;
      }
      case TxType.Deposit: {
        const depositFee = getDepositFee(token, gasPrice);
        const newMaxAmount = maxAmount.sub(depositFee);

        return newMaxAmount.gt(0) ? newMaxAmount : BigNumber.from(0);
      }
      default: {
        const l2FeeBigInt = parseUnits(l2Fee.toFixed(token.decimals), token.decimals);

        return BigNumber.from(
          getMaxAmountFromMinimumFee(l2FeeBigInt.toString(), maxAmount.toString()).toString()
        );
      }
    }
  })();

  return fixTransactionAmount(maxTxAmount);
}

export {
  getTransactionAmount,
  getTxPendingTime,
  mergeDelayedWithdraws,
  mergeExits,
  isTransactionAmountCompressedValid,
  fixTransactionAmount,
  getMaxTxAmount,
};
