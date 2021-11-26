import React from "react";

// domain
import { FiatExchangeRates } from "src/domain/hermez";
import { EstimatedL1Fee } from "src/domain";
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
  return (
    <>
      {isAsyncTaskDataAvailable(estimatedDepositFeeTask) &&
        isAsyncTaskDataAvailable(fiatExchangeRatesTask) && (
          <Alert
            message={
              <>
                {`You don’t have enough ETH to cover deposit transaction fee (you need at least
            ${getFixedTokenAmount(estimatedDepositFeeTask.data.amount.toString())} ETH) ~`}
                <FiatAmount
                  amount={getTokenAmountInPreferredCurrency(
                    estimatedDepositFeeTask.data.amount.toString(),
                    estimatedDepositFeeTask.data.token.USD,
                    preferredCurrency,
                    fiatExchangeRatesTask.data
                  )}
                  currency={preferredCurrency}
                />
              </>
            }
          />
        )}
    </>
  );
}

export default DepositAlert;
