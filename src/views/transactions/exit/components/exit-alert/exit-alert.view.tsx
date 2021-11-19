// ToDo: Remove the disable of TS and the linter below once the component are migrated to TS
/* eslint-disable */
// @ts-nocheck
import React from "react";
import { BigNumber } from "@ethersproject/bignumber";
import { utils } from "ethers";

import { EstimatedWithdrawFee } from "src/domain";
import { AsyncTask, isAsyncTaskCompleted } from "src/utils/types";
import Alert from "src/views/shared/alert/alert.view";

interface ExitAlertProps {
  estimatedWithdrawFeeTask: AsyncTask<EstimatedWithdrawFee, Error>;
}

function ExitAlert({ estimatedWithdrawFeeTask }: ExitAlertProps): JSX.Element {
  function getMessage(estimatedWithdrawFee: BigNumber) {
    return (
      "You don’t have enough ETH to cover withdrawal transaction fee" +
      "(you need at least " +
      utils.formatUnits(estimatedWithdrawFee) +
      " ETH"
    );
  }

  return (
    <>
      {isAsyncTaskCompleted(estimatedWithdrawFeeTask) && (
        <Alert message={getMessage(estimatedWithdrawFeeTask.data.amount)} />
      )}
    </>
  );
}

export default ExitAlert;
