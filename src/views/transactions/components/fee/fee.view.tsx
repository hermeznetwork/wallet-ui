import React from "react";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";
import { BigNumber } from "@ethersproject/bignumber";

import useFeeStyles from "src/views/transactions/components/fee/fee.styles";
import { getFixedTokenAmount, getTokenAmountInPreferredCurrency } from "src/utils/currencies";
import { ReactComponent as AngleDownIcon } from "src/images/icons/angle-down.svg";
import FeesTable from "src/views/shared/fees-table/fees-table.view";
import FiatAmount from "src/views/shared/fiat-amount/fiat-amount.view";
// domain
import { FiatExchangeRates, Token } from "src/domain/hermez";
import { EstimatedL1Fee } from "src/domain";
import { AsyncTask, isAsyncTaskCompleted } from "src/utils/types";
import { getEstimatedWithdrawFee } from "src/utils/fees";

export interface CommonFeeProps {
  token: Token;
  amount: BigNumber;
  showInFiat: boolean;
  preferredCurrency: string;
  fiatExchangeRatesTask: AsyncTask<FiatExchangeRates, string>;
}

interface FeeDepositProps {
  txType: TxType.Deposit;
  estimatedDepositFeeTask: AsyncTask<EstimatedL1Fee, Error>;
}

interface FeeTransferProps {
  txType: TxType.Transfer;
  fee: BigNumber;
}

interface FeeExitProps {
  txType: TxType.Exit;
  fee: BigNumber;
  estimatedWithdrawFeeTask: AsyncTask<EstimatedL1Fee, Error>;
}

type FeeProps = CommonFeeProps & (FeeDepositProps | FeeTransferProps | FeeExitProps);

function Fee(props: FeeProps): JSX.Element {
  const [isWithdrawFeeExpanded, setIsWithdrawFeeExpanded] = React.useState(false);
  const classes = useFeeStyles({ isWithdrawFeeExpanded });

  const { txType, token, showInFiat, preferredCurrency, fiatExchangeRatesTask } = props;

  function handleWithdrawFeeExpansion() {
    setIsWithdrawFeeExpanded(!isWithdrawFeeExpanded);
  }

  switch (txType) {
    case TxType.Deposit: {
      const { estimatedDepositFeeTask } = props;
      const formattedDepositFee = isAsyncTaskCompleted(estimatedDepositFeeTask)
        ? getFixedTokenAmount(estimatedDepositFeeTask.data.amount.toString())
        : "0";
      const depositFeeInFiat = isAsyncTaskCompleted(estimatedDepositFeeTask)
        ? getTokenAmountInPreferredCurrency(
            formattedDepositFee,
            estimatedDepositFeeTask.data.token.USD,
            preferredCurrency,
            isAsyncTaskCompleted(fiatExchangeRatesTask) ? fiatExchangeRatesTask.data : {}
          )
        : undefined;

      return (
        <p className={classes.fee}>
          Ethereum fee (estimated) - <span>{formattedDepositFee} ETH</span> ~{" "}
          <FiatAmount
            amount={depositFeeInFiat}
            currency={preferredCurrency}
            className={classes.fiatAmount}
          />
        </p>
      );
    }
    case TxType.Transfer: {
      const { fee } = props;
      const formattedFee = getFixedTokenAmount(fee.toString(), token.decimals);
      const feeInFiat = getTokenAmountInPreferredCurrency(
        formattedFee,
        token.USD,
        preferredCurrency,
        isAsyncTaskCompleted(fiatExchangeRatesTask) ? fiatExchangeRatesTask.data : {}
      );

      return (
        <p className={classes.fee}>
          Fee{" "}
          {showInFiat ? (
            <FiatAmount amount={feeInFiat} currency={preferredCurrency} />
          ) : (
            <span>{`${getFixedTokenAmount(fee.toString(), token.decimals)} ${token.symbol}`}</span>
          )}
        </p>
      );
    }
    case TxType.Exit: {
      const { fee, estimatedWithdrawFeeTask } = props;

      return (
        <div className={classes.withdrawFeeWrapper}>
          <button className={classes.withdrawFeeButton} onClick={handleWithdrawFeeExpansion}>
            <span className={classes.withdrawFeeButtonText}>
              Total estimated fee{" "}
              <FiatAmount
                amount={
                  isAsyncTaskCompleted(estimatedWithdrawFeeTask) &&
                  isAsyncTaskCompleted(fiatExchangeRatesTask)
                    ? getEstimatedWithdrawFee(
                        fee,
                        token,
                        estimatedWithdrawFeeTask.data,
                        preferredCurrency,
                        fiatExchangeRatesTask.data
                      )
                    : undefined
                }
                currency={preferredCurrency}
                className={classes.fiatAmount}
              />
            </span>
            <AngleDownIcon
              className={`${classes.withdrawFeeButtonIcon} ${classes.withdrawFeeButtonIconPath}`}
            />
          </button>
          {isWithdrawFeeExpanded && isAsyncTaskCompleted(fiatExchangeRatesTask) && (
            <FeesTable
              l2Fee={fee}
              estimatedWithdrawFee={
                isAsyncTaskCompleted(estimatedWithdrawFeeTask)
                  ? estimatedWithdrawFeeTask.data
                  : undefined
              }
              token={token}
              preferredCurrency={preferredCurrency}
              fiatExchangeRates={fiatExchangeRatesTask.data}
            />
          )}
        </div>
      );
    }
  }
}

export default Fee;
