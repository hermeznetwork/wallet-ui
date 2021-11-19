// ToDo: Remove the disable of TS and the linter below once the component are migrated to TS
/* eslint-disable */
// @ts-nocheck
import React from "react";

import { EstimatedDepositFee } from "src/domain";
import { FiatExchangeRates } from "src/domain/hermez";
import { getTokenAmountInPreferredCurrency } from "src/utils/currencies";
import { AsyncTask, isAsyncTaskCompleted } from "src/utils/types";
import Alert from "src/views/shared/alert/alert.view";
import FiatAmount from "src/views/shared/fiat-amount/fiat-amount.view";

interface DepositAlertProps {
  estimatedDepositFeeTask: AsyncTask<EstimatedDepositFee, Error>;
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
      {isAsyncTaskCompleted(estimatedDepositFeeTask) &&
        isAsyncTaskCompleted(fiatExchangeRatesTask) && (
          <Alert
            message={
              <>
                {`You don’t have enough ETH to cover deposit transaction fee (you need at least
            ${estimatedDepositFeeTask.data.amount} ETH) ~`}
                <FiatAmount
                  amount={getTokenAmountInPreferredCurrency(
                    estimatedDepositFeeTask.data.amount,
                    estimatedDepositFeeTask.data.USD,
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
