import { GAS_LIMIT_LOW } from "@hermeznetwork/hermezjs/src/constants";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";
import { getFeeIndex, getFeeValue } from "@hermeznetwork/hermezjs/src/tx-utils";
import { getTokenAmountBigInt, getTokenAmountString } from "@hermeznetwork/hermezjs/src/utils";
import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";

/**
 * Calculates the fee for a L1 deposit into Hermez Network
 * @param {Object} token - Token object
 * @param {BigNumber} gasPrice - Ethereum gas price
 * @returns depositFee
 */
function getDepositFee(token, gasPrice) {
  return token.id === 0 ? BigNumber.from(GAS_LIMIT_LOW).mul(gasPrice) : BigNumber.from(0);
}

/**
 * Calculates the actual fee that will be paid for a specific transaction
 * taking into account the type of transaction, the amount and minimum fee
 * @param {Number} amount - The amount of the transaction
 * @param {Object} token - The token used in the transaction
 * @param {Number} minimumFee - The minimum fee that needs to be payed to the coordinator in token value
 * @returns {Number} The real fee that will be paid for this transaction
 */
function getRealFee(amount, token, minimumFee) {
  const decimals = token.decimals;
  const minimumFeeBigInt = getTokenAmountBigInt(minimumFee.toFixed(decimals), decimals).toString();
  const feeIndex = getFeeIndex(minimumFeeBigInt, amount);
  const fee = getFeeValue(feeIndex, amount);

  return Number(getTokenAmountString(fee, decimals));
}

/**
 *
 * @param {TxType} txType - Type of the transaction
 * @param {BigNumber} amount - Amount to be send in the transaction
 * @param {Object} token - Token object
 * @param {Number} l2Fee - Transaction fee
 * @param {BigNumber} gasPrice - Ethereum gas price
 * @returns txFee
 */
function getTransactionFee(txType, amount, token, l2Fee, gasPrice) {
  switch (txType) {
    case TxType.Deposit: {
      return getDepositFee(token, gasPrice);
    }
    case TxType.ForceExit: {
      return BigNumber.from(0);
    }
    default: {
      return parseUnits(getRealFee(amount, token, l2Fee).toString());
    }
  }
}

export { getDepositFee, getRealFee, getTransactionFee };
