import React from "react";

// domain
import { EstimatedL1Fee } from "src/domain";
// utils
import { AsyncTask, isAsyncTaskDataAvailable } from "src/utils/types";
import { getFixedTokenAmount } from "src/utils/currencies";
// views
import Alert from "src/views/shared/alert/alert.view";

interface ExitAlertProps {
  estimatedWithdrawFeeTask: AsyncTask<EstimatedL1Fee, Error>;
}

function ExitAlert({ estimatedWithdrawFeeTask }: ExitAlertProps): JSX.Element {
  function getMessage(estimatedWithdrawFee: EstimatedL1Fee) {
    const formattedEstimatedWithdrawFee = getFixedTokenAmount(
      estimatedWithdrawFee.amount.toString()
    );

    return (
      "You don’t have enough ETH to cover withdrawal transaction fee" +
      "(you need at least " +
      formattedEstimatedWithdrawFee +
      " ETH"
    );
  }

  return (
    <>
      {isAsyncTaskDataAvailable(estimatedWithdrawFeeTask) && (
        <Alert message={getMessage(estimatedWithdrawFeeTask.data)} />
      )}
    </>
  );
}

export default ExitAlert;
