import { isHermezBjjAddress } from "@hermeznetwork/hermezjs/src/addresses";
import { GAS_LIMIT_LOW } from "@hermeznetwork/hermezjs/src/constants";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";
import { getFeeIndex, getFeeValue } from "@hermeznetwork/hermezjs/src/tx-utils";
import { getTokenAmountString } from "@hermeznetwork/hermezjs/src/utils";
import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";
// constants
import { MAX_FEE_USD, MAX_TOKEN_DECIMALS } from "src/constants";
import { EstimatedL1Fee } from "src/domain";
// domain
import { FiatExchangeRates, RecommendedFee, Token } from "src/domain/hermez";
import { AsyncTask, isAsyncTaskDataAvailable } from "src/utils/types";
import { getFixedTokenAmount, getTokenAmountInPreferredCurrency } from "./currencies";

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
function getMinimumL2Fee(params: GetMinimumL2FeeParams): BigNumber {
  const { txType, token, feesTask } = params;

  if (!isAsyncTaskDataAvailable(feesTask) || token.USD === 0) {
    return BigNumber.from(0);
  }

  const feeInUsd = (() => {
    if (txType === TxType.Exit || params.doesAccountAlreadyExist) {
      return feesTask.data.existingAccount;
    } else {
      return isHermezBjjAddress(params.receiverAddress)
        ? feesTask.data.createAccountInternal
        : feesTask.data.createAccount;
    }
  })();
  // Limits the fee, in case a crazy fee is returned
  const limitedFee = feeInUsd > MAX_FEE_USD ? MAX_FEE_USD : feeInUsd;
  const fee = (limitedFee / token.USD).toFixed(MAX_TOKEN_DECIMALS);

  return parseUnits(fee, token.decimals);
}

/**
 * Calculates the actual fee that will be paid for a specific transaction
 * taking into account the type of transaction, the amount and minimum fee
 */
function getL2Fee(amount: string, token: Token, minimumFee: BigNumber): number {
  const decimals = token.decimals;
  const feeIndex = getFeeIndex(minimumFee.toString(), amount);
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
  minimumFee: BigNumber;
}

type GetTxFeeParams = GetDepositFeeParams | GetForceExitFeeParams | GetL2FeeParams;

/**
 * Calculates the fee that will be paid for all the existing transaction types
 */
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

/**
 * Calculates the total estimated fee for a withdraw in fiat, taking into account the exit fees and
 * the withdraw fees.
 */
function getEstimatedWithdrawFee(
  exitFee: BigNumber,
  token: Token,
  estimatedWithdrawFee: EstimatedL1Fee,
  preferredCurrency: string,
  fiatExchangeRates: FiatExchangeRates
): number {
  const formattedExitFee = getFixedTokenAmount(exitFee.toString(), token.decimals);
  const formattedWithdrawFee = getFixedTokenAmount(estimatedWithdrawFee.amount.toString());
  const exitFeeInFiat = getTokenAmountInPreferredCurrency(
    formattedExitFee,
    token.USD,
    preferredCurrency,
    fiatExchangeRates
  );
  const withdrawFeeInFiat = getTokenAmountInPreferredCurrency(
    formattedWithdrawFee,
    estimatedWithdrawFee.token.USD,
    preferredCurrency,
    fiatExchangeRates
  );

  return exitFeeInFiat + withdrawFeeInFiat;
}

export { getMinimumL2Fee, getTxFee, getEstimatedWithdrawFee };
