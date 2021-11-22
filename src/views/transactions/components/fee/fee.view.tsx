import React from "react";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";
import { BigNumber } from "@ethersproject/bignumber";

import useFeeStyles from "src/views/transactions/components/fee/fee.styles";
import {
  getAmountInPreferredCurrency,
  getFixedTokenAmount,
  getTokenAmountInPreferredCurrency,
} from "src/utils/currencies";
import { ReactComponent as AngleDownIcon } from "src/images/icons/angle-down.svg";
import FeesTable from "src/views/shared/fees-table/fees-table.view";
import FiatAmount from "src/views/shared/fiat-amount/fiat-amount.view";
// domain
import { FiatExchangeRates, Token } from "src/domain/hermez";
import { EstimatedL1Fee } from "src/domain";
import { AsyncTask, isAsyncTaskCompleted } from "src/utils/types";

export interface CommonFeeProps {
  token: Token;
  amount: BigNumber;
  showInFiat: boolean;
  preferredCurrency: string;
  fiatExchangeRatesTask: AsyncTask<FiatExchangeRates, string>;
}

interface FeeDepositProps {
  txType: TxType.Deposit;
  fee: BigNumber;
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

  const { fee } = props;
  const formattedFee = getFixedTokenAmount(fee.toString(), token.decimals);
  const feeInFiat = getTokenAmountInPreferredCurrency(
    formattedFee,
    token.USD,
    preferredCurrency,
    isAsyncTaskCompleted(fiatExchangeRatesTask) ? fiatExchangeRatesTask.data : {}
  );

  function getTotalEstimatedWithdrawFee(
    exitFeeInFiat: number,
    estimatedWithdrawFeeTask: AsyncTask<EstimatedL1Fee, Error>
  ) {
    if (
      !isAsyncTaskCompleted(estimatedWithdrawFeeTask) ||
      !isAsyncTaskCompleted(fiatExchangeRatesTask)
    ) {
      return undefined;
    }

    const estimatedWithdrawFeeInFiat = getAmountInPreferredCurrency(
      estimatedWithdrawFeeTask.data.USD,
      preferredCurrency,
      fiatExchangeRatesTask.data
    );

    return exitFeeInFiat + estimatedWithdrawFeeInFiat;
  }

  function handleWithdrawFeeExpansion() {
    setIsWithdrawFeeExpanded(!isWithdrawFeeExpanded);
  }

  switch (txType) {
    case TxType.Deposit: {
      return (
        <p className={classes.fee}>
          Ethereum fee (estimated) - <span>{formattedFee} ETH</span> ~{" "}
          <FiatAmount
            amount={feeInFiat}
            currency={preferredCurrency}
            className={classes.fiatAmount}
          />
        </p>
      );
    }
    case TxType.Transfer: {
      return (
        <p className={classes.fee}>
          Fee{" "}
          {showInFiat ? (
            <FiatAmount
              amount={feeInFiat}
              currency={preferredCurrency}
              /* ToDo delete */
              className=""
            />
          ) : (
            <span>{`${getFixedTokenAmount(fee.toString(), token.decimals)} ${token.symbol}`}</span>
          )}
        </p>
      );
    }
    case TxType.Exit: {
      const { estimatedWithdrawFeeTask } = props;

      return (
        <div className={classes.withdrawFeeWrapper}>
          <button className={classes.withdrawFeeButton} onClick={handleWithdrawFeeExpansion}>
            <span className={classes.withdrawFeeButtonText}>
              Total estimated fee{" "}
              <FiatAmount
                amount={getTotalEstimatedWithdrawFee(feeInFiat, estimatedWithdrawFeeTask)}
                currency={preferredCurrency}
                className={classes.fiatAmount}
              />
            </span>
            <AngleDownIcon
              className={`${classes.withdrawFeeButtonIcon} ${classes.withdrawFeeButtonIconPath}`}
            />
          </button>
          {isWithdrawFeeExpanded &&
            isAsyncTaskCompleted(estimatedWithdrawFeeTask) &&
            isAsyncTaskCompleted(fiatExchangeRatesTask) && (
              <FeesTable
                l2Fee={formattedFee}
                l2FeeInFiat={feeInFiat}
                estimatedWithdrawFee={estimatedWithdrawFeeTask.data}
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
