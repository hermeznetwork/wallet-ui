import { getFeeIndex, getFeeValue } from '@hermeznetwork/hermezjs/src/tx-utils'
import { getTokenAmountBigInt, getTokenAmountString } from '@hermeznetwork/hermezjs/src/utils'

/**
   * Calculates the actual fee that will be paid for a specific transaction
   * taking into account the type of transaction, the amount and minimum fee
   * @param {Number} minimumFee - The minimum fee that needs to be payed to the coordinator in token value
   * @returns {Number} The real fee that will be paid for this transaction
   */
function getRealFee (amount, token, minimumFee) {
  const decimals = token.decimals
  const minimumFeeBigInt = getTokenAmountBigInt(minimumFee.toFixed(decimals), decimals).toString()
  const feeIndex = getFeeIndex(minimumFeeBigInt, amount)
  const fee = getFeeValue(feeIndex, amount)

  return Number(getTokenAmountString(fee, decimals))
}

export { getRealFee }
