import { GAS_LIMIT_LOW } from "@hermeznetwork/hermezjs/src/constants";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";
import { getFeeIndex, getFeeValue } from "@hermeznetwork/hermezjs/src/tx-utils";
import { getTokenAmountBigInt, getTokenAmountString } from "@hermeznetwork/hermezjs/src/utils";
import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";

// domain
import { Token, ScalarValue } from "src/domain/hermez";

/**
 * Calculates the fee for a L1 deposit into Hermez Network
 */
function getDepositFee(token: Token, gasPrice: BigNumber): BigNumber {
  return token.id === 0 ? BigNumber.from(GAS_LIMIT_LOW).mul(gasPrice) : BigNumber.from(0);
}

/**
 * Calculates the actual fee that will be paid for a specific transaction
 * taking into account the type of transaction, the amount and minimum fee
 */
function getRealFee(amount: ScalarValue, token: Token, minimumFee: number): number {
  const decimals = token.decimals;
  const minimumFeeBigInt = getTokenAmountBigInt(minimumFee.toFixed(decimals), decimals).toString();
  const feeIndex = getFeeIndex(minimumFeeBigInt, amount);
  const fee = getFeeValue(feeIndex, amount);

  return Number(getTokenAmountString(fee, decimals));
}

function getTransactionFee(
  txType: TxType,
  amount: BigNumber,
  token: Token,
  l2Fee: number,
  gasPrice: BigNumber
): BigNumber {
  switch (txType) {
    case TxType.Deposit: {
      return getDepositFee(token, gasPrice);
    }
    case TxType.ForceExit: {
      return BigNumber.from(0);
    }
    default: {
      return parseUnits(getRealFee(amount.toString(), token, l2Fee).toString(), token.decimals);
    }
  }
}

export { getDepositFee, getRealFee, getTransactionFee };
