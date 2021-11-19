import { isHermezBjjAddress } from "@hermeznetwork/hermezjs/src/addresses";
import { GAS_LIMIT_LOW } from "@hermeznetwork/hermezjs/src/constants";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";
import { getFeeIndex, getFeeValue } from "@hermeznetwork/hermezjs/src/tx-utils";
import { getTokenAmountBigInt, getTokenAmountString } from "@hermeznetwork/hermezjs/src/utils";
import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";
// constants
import { MAX_FEE_USD } from "src/constants";
// domain
import { RecommendedFee, Token } from "src/domain/hermez";
import { AsyncTask, isAsyncTaskCompleted } from "src/utils/types";

/**
 * Calculates the fee for a L1 deposit into Hermez Network
 */
function getDepositFee(token: Token, gasPrice: BigNumber): BigNumber {
  return token.id === 0 ? BigNumber.from(GAS_LIMIT_LOW).mul(gasPrice) : BigNumber.from(0);
}

interface GetMinimumTransferFee {
  txType: TxType.Transfer;
  receiverAddress: string;
  doesAccountAlreadyExist: boolean;
  token: Token;
  feesTask: AsyncTask<RecommendedFee, Error>;
}

interface GetMinimumExitFee {
  txType: TxType.Exit;
  token: Token;
  feesTask: AsyncTask<RecommendedFee, Error>;
}

type GetMinimumL2FeeParams = GetMinimumTransferFee | GetMinimumExitFee;

/**
 * Calculates the minimum fee that will be paid for the transaction, without taking into account
 * the amount
 */
function getMinimumL2Fee(params: GetMinimumL2FeeParams): number {
  const { txType, token, feesTask } = params;

  if (!isAsyncTaskCompleted(feesTask) || token.USD === 0) {
    return 0;
  }

  const fee = (() => {
    if (txType === TxType.Exit) {
      return feesTask.data.existingAccount;
    } else {
      return params.doesAccountAlreadyExist
        ? feesTask.data.existingAccount
        : isHermezBjjAddress(params.receiverAddress)
        ? feesTask.data.createAccountInternal
        : feesTask.data.createAccount;
    }
  })();

  // Limits the fee, in case a crazy fee is returned
  const fixedFee = fee > MAX_FEE_USD ? MAX_FEE_USD : fee;

  return fixedFee / token.USD;
}

/**
 * Calculates the actual fee that will be paid for a specific transaction
 * taking into account the type of transaction, the amount and minimum fee
 */
function getL2Fee(amount: string, token: Token, minimumFee: number): number {
  const decimals = token.decimals;
  const minimumFeeBigInt = getTokenAmountBigInt(minimumFee.toFixed(decimals), decimals).toString();
  const feeIndex = getFeeIndex(minimumFeeBigInt, amount);
  const fee = getFeeValue(feeIndex, amount);

  return Number(getTokenAmountString(fee, decimals));
}

interface GetDepositFeeParams {
  txType: TxType.Deposit;
  token: Token;
  gasPrice: BigNumber;
}

interface GetForceExitFeeParams {
  txType: TxType.ForceExit;
}

interface GetL2FeeParams {
  txType: TxType.Transfer | TxType.Exit;
  amount: BigNumber;
  token: Token;
  minimumFee: number;
}

type GetTxFeeParams = GetDepositFeeParams | GetForceExitFeeParams | GetL2FeeParams;
function getTxFee(params: GetTxFeeParams): BigNumber {
  switch (params.txType) {
    case TxType.Deposit: {
      return getDepositFee(params.token, params.gasPrice);
    }
    case TxType.ForceExit: {
      return BigNumber.from(0);
    }
    default: {
      const { amount, token, minimumFee } = params;

      return parseUnits(getL2Fee(amount.toString(), token, minimumFee).toString(), token.decimals);
    }
  }
}

export { getMinimumL2Fee, getTxFee };
