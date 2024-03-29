import { BigNumber } from 'ethers'
import { HermezCompressedAmount } from '@hermeznetwork/hermezjs'
import { TxType } from '@hermeznetwork/hermezjs/src/enums'
import { parseUnits } from 'ethers/lib/utils'

import { getMaxAmountFromMinimumFee } from '@hermeznetwork/hermezjs/src/tx-utils'
import { getDepositFee } from './fees'

/**
 * Returns the correct amount for a transaction from the Hermez API depending on its type
 * @param {Object} transaction - Transaction from the Hermez API
 * @returns amount
 */
function getTransactionAmount (transaction) {
  if (!transaction) {
    return undefined
  }

  if (!transaction.L1Info) {
    return transaction.amount
  } else {
    if (transaction.type === TxType.Deposit || transaction.type === TxType.CreateAccountDeposit) {
      return transaction.L1Info.depositAmount
    } else {
      return transaction.amount
    }
  }
}

/**
 * Calculates an estimated time until the transaction will be forged
 * If it's an L1 transaction, it adds the forgeDelay again
 *
 * @param {Object} coordinatorState - As returned from the API
 * @param {Boolean} isL1 - Whether it is an L1 transaction
 * @param {Date} timestamp - If it's an L1 transaction, also pass in the timestamp
 *
 * @returns {Number} timeLeftToForgeInMinutes
 */
function getTxPendingTime (coordinatorState, isL1, timestamp) {
  if (!coordinatorState) {
    return 0
  }
  const timeToForge = coordinatorState.node.forgeDelay
  const lastBatchForgedInSeconds = Date.parse(coordinatorState.network.lastBatch.timestamp) / 1000
  const whenToForgeInSeconds = timeToForge + lastBatchForgedInSeconds
  const nowInSeconds = Date.now() / 1000
  const timestampInSeconds = Date.parse(timestamp) / 1000
  const timeLeftToForgeInSeconds = whenToForgeInSeconds - nowInSeconds + (isL1 && timestampInSeconds > lastBatchForgedInSeconds ? timeToForge : 0)
  const timeLeftToForgeInMinutes = Math.round(timeLeftToForgeInSeconds / 60)
  return timeLeftToForgeInMinutes > 0 ? timeLeftToForgeInMinutes : 0
}

/**
 * Delayed Withdraws, once they are in the WithdrawalDelayer smart contract,
 * are merged by token. We need to manually merge them to show the correct
 * information to the user.
 *
 * @param {Array} pendingDelayedWithdraws - All the pending delayed withdraws stored in LocalStorage
 * @returns {Array} mergedPendingDelayedWithdraws
 */
function mergeDelayedWithdraws (pendingDelayedWithdraws) {
  return pendingDelayedWithdraws
    .reduce((mergedPendingDelayedWithdraws, pendingDelayedWithdraw) => {
      const existingPendingDelayedWithdrawWithToken = mergedPendingDelayedWithdraws
        .find((delayedWithdraw) => delayedWithdraw.token.id === pendingDelayedWithdraw.token.id)

      if (!existingPendingDelayedWithdrawWithToken) {
        mergedPendingDelayedWithdraws.push(pendingDelayedWithdraw)
      } else {
        mergedPendingDelayedWithdraws = mergedPendingDelayedWithdraws.map((mergedPendingDelayedWithdraw) => {
          if (mergedPendingDelayedWithdraw === existingPendingDelayedWithdrawWithToken) {
            // We need to sum up the amounts and use the latest timestamp for the timer
            return {
              ...mergedPendingDelayedWithdraw,
              amount: BigNumber.from(mergedPendingDelayedWithdraw.amount)
                .add(BigNumber.from(pendingDelayedWithdraw.amount))
                .toString(),
              timestamp: Date.parse(mergedPendingDelayedWithdraw.timestamp) > Date.parse(pendingDelayedWithdraw.timestamp)
                ? mergedPendingDelayedWithdraw.timestamp
                : pendingDelayedWithdraw.timestamp
            }
          } else {
            return mergedPendingDelayedWithdraw
          }
        })
      }

      return mergedPendingDelayedWithdraws
    }, [])
}

/**
 * Helper function that merges both Exits and Delayed Withdraws
 *
 * @param {Array} exits - List of Exits returned by the API
 * @param {Array} pendingDelayedWithdraws - All the pending delayed withdraws stored in LocalStorage
 * @returns {Array} mergedExits
 */
function mergeExits (exits, pendingDelayedWithdraws) {
  // Remove Exits that are now pending Delayed Withdraws
  const nonDelayedExits = exits.filter((exit) => {
    const exitId = exit.accountIndex + exit.batchNum
    return !pendingDelayedWithdraws
      .find((pendingDelayedWithdraw) => pendingDelayedWithdraw.id === exitId)
  })

  // Merge pending Delayed Withdraws that share the same token id
  const mergedDelayedExits = mergeDelayedWithdraws(pendingDelayedWithdraws)

  return [...mergedDelayedExits, ...nonDelayedExits]
}

/**
 * Checks whether an amount is supported by the compression
 * used in the Hermez network
 * @param {Number} amount - Selector amount
 * @returns {Boolean} Whether it is valid
 */
function isTransactionAmountCompressedValid (amount) {
  try {
    const compressedAmount = HermezCompressedAmount.compressAmount(amount)
    const decompressedAmount = HermezCompressedAmount.decompressAmount(compressedAmount)

    return amount.toString() === decompressedAmount.toString()
  } catch (e) {
    return false
  }
}

/**
 * Fixes the transaction amount to be sure that it would be supported by Hermez
 * @param {BigNumber} amount - Transaction amount to be fixed
 * @returns fixedTxAmount
 */
function fixTransactionAmount (amount) {
  const fixedTxAmount = HermezCompressedAmount.decompressAmount(
    HermezCompressedAmount.floorCompressAmount(amount)
  )

  return BigNumber.from(fixedTxAmount)
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
function getMaxTxAmount (txType, maxAmount, token, l2Fee, gasPrice) {
  const maxTxAmount = (() => {
    switch (txType) {
      case TxType.ForceExit: {
        return maxAmount
      }
      case TxType.Deposit: {
        const depositFee = getDepositFee(token, gasPrice)
        const newMaxAmount = maxAmount.sub(depositFee)

        return newMaxAmount.gt(0)
          ? newMaxAmount
          : BigNumber.from(0)
      }
      default: {
        const l2FeeBigInt = parseUnits(l2Fee.toFixed(token.decimals), token.decimals)

        return BigNumber.from(getMaxAmountFromMinimumFee(l2FeeBigInt, maxAmount).toString())
      }
    }
  })()

  return fixTransactionAmount(maxTxAmount)
}

export {
  getTransactionAmount,
  getTxPendingTime,
  mergeDelayedWithdraws,
  mergeExits,
  isTransactionAmountCompressedValid,
  fixTransactionAmount,
  getMaxTxAmount
}
