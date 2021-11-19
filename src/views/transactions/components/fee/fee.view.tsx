// ToDo: Remove the disable of TS and the linter below once the component are migrated to TS
/* eslint-disable */
// @ts-nocheck
import React from "react";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";
import { BigNumber } from "@ethersproject/bignumber";
import { parseUnits } from "ethers/lib/utils";

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
import { EstimatedWithdrawFee, EstimatedDepositFee } from "src/domain";
import { AsyncTask, isAsyncTaskCompleted } from "src/utils/types";

export interface CommonFeeProps {
  token: Token;
  amount: BigNumber;
  showInFiat: boolean;
  preferredCurrency: string;
  fiatExchangeRatesTask: AsyncTask<FiatExchangeRates, string>;
}

interface FeeDepositProps {
  transactionType: TxType.Deposit;
  estimatedDepositFeeTask: AsyncTask<EstimatedDepositFee, Error>;
}

interface FeeTransferProps {
  transactionType: TxType.Transfer;
  fee: BigNumber;
}

interface FeeExitProps {
  transactionType: TxType.Exit;
  fee: BigNumber;
  estimatedWithdrawFeeTask: AsyncTask<EstimatedWithdrawFee, Error>;
}

type FeeProps = CommonFeeProps & (FeeDepositProps | FeeTransferProps | FeeExitProps);

function Fee(props: FeeProps): JSX.Element {
  const [isWithdrawFeeExpanded, setIsWithdrawFeeExpanded] = React.useState(false);
  const classes = useFeeStyles({ isWithdrawFeeExpanded });

  const { transactionType, token, showInFiat, preferredCurrency, fiatExchangeRatesTask } = props;

  function getDepositFeeInFiat(estimatedDepositFeeTask: AsyncTask<EstimatedDepositFee, Error>) {
    if (
      !isAsyncTaskCompleted(estimatedDepositFeeTask) ||
      !isAsyncTaskCompleted(fiatExchangeRatesTask)
    ) {
      return undefined;
    }

    return getTokenAmountInPreferredCurrency(
      estimatedDepositFeeTask.data.amount.toString(),
      estimatedDepositFeeTask.data.USD,
      preferredCurrency,
      isAsyncTaskCompleted(fiatExchangeRatesTask) ? fiatExchangeRatesTask.data : {}
    );
  }

  function getTotalEstimatedWithdrawFee(
    l2FeeInFiat: number,
    estimatedWithdrawFeeTask: AsyncTask<EstimatedWithdrawFee, Error>
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

    return l2FeeInFiat + estimatedWithdrawFeeInFiat;
  }

  function handleWithdrawFeeExpansion() {
    setIsWithdrawFeeExpanded(!isWithdrawFeeExpanded);
  }

  switch (transactionType) {
    case TxType.Deposit: {
      const { estimatedDepositFeeTask } = props;
      const estimatedDepositFee = isAsyncTaskCompleted(estimatedDepositFeeTask)
        ? estimatedDepositFeeTask.data.amount
        : "--";

      return (
        <p className={classes.fee}>
          Ethereum fee (estimated) - <span>{estimatedDepositFee} ETH</span> ~{" "}
          <FiatAmount
            amount={getDepositFeeInFiat(estimatedDepositFeeTask)}
            currency={preferredCurrency}
            className={classes.fiatAmount}
          />
        </p>
      );
    }
    case TxType.Transfer: {
      const { fee } = props;
      const feeInFiat = getTokenAmountInPreferredCurrency(
        fee.toString(),
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
            <span>
              {`${getFixedTokenAmount(
                parseUnits(fee.toString(), token.decimals).toString(),
                token.decimals
              )} 
                ${token.symbol}`}
            </span>
          )}
        </p>
      );
    }
    case TxType.Exit: {
      const { estimatedWithdrawFeeTask, fee } = props;
      const feeInFiat = getTokenAmountInPreferredCurrency(
        fee.toString(),
        token.USD,
        preferredCurrency,
        isAsyncTaskCompleted(fiatExchangeRatesTask) ? fiatExchangeRatesTask.data : {}
      );

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
                l2Fee={getFixedTokenAmount(
                  parseUnits(fee.toString(), token.decimals).toString(),
                  token.decimals
                )}
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
