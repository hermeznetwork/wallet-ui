import { BigNumber } from 'ethers'

import { TxType } from '@hermeznetwork/hermezjs/src/enums'

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

export {
  getTransactionAmount,
  getTxPendingTime,
  mergeDelayedWithdraws,
  mergeExits
}
