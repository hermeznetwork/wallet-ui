import React from "react";

// domain
import { FiatExchangeRates, EstimatedL1Fee } from "src/domain";
// utils
import { getFixedTokenAmount, getTokenAmountInPreferredCurrency } from "src/utils/currencies";
import { AsyncTask, isAsyncTaskDataAvailable } from "src/utils/types";
// views
import Alert from "src/views/shared/alert/alert.view";
import FiatAmount from "src/views/shared/fiat-amount/fiat-amount.view";

interface DepositAlertProps {
  estimatedDepositFeeTask: AsyncTask<EstimatedL1Fee, Error>;
  preferredCurrency: string;
  fiatExchangeRatesTask: AsyncTask<FiatExchangeRates, string>;
}

function DepositAlert({
  estimatedDepositFeeTask,
  preferredCurrency,
  fiatExchangeRatesTask,
}: DepositAlertProps): JSX.Element {
  if (
    !isAsyncTaskDataAvailable(estimatedDepositFeeTask) ||
    !isAsyncTaskDataAvailable(fiatExchangeRatesTask)
  ) {
    return <></>;
  }

  const fixedTokenAmount = getFixedTokenAmount(estimatedDepositFeeTask.data.amount.toString());

  return (
    <Alert
      message={
        <>
          {`You don’t have enough ETH to cover the deposit fee (you need at least
              ${fixedTokenAmount} ETH) ~ `}
          <FiatAmount
            amount={getTokenAmountInPreferredCurrency(
              fixedTokenAmount,
              estimatedDepositFeeTask.data.token,
              preferredCurrency,
              fiatExchangeRatesTask.data
            )}
            currency={preferredCurrency}
          />
        </>
      }
    />
  );
}

export default DepositAlert;
