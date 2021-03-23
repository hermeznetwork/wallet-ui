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

export {
  getTransactionAmount,
  getTxPendingTime
}
