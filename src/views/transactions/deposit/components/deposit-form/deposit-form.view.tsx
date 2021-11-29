import React from "react";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";
import { BigNumber } from "@ethersproject/bignumber";

import useDepositFormStyles from "src/views/transactions/deposit/components/deposit-form/deposit-form.styles";
import { EthereumAccount, FiatExchangeRates } from "src/domain/hermez";
import FormContainer from "src/views/transactions/components/form-container/form.container.view";
import { AsyncTask, isAsyncTaskDataAvailable } from "src/utils/types";
import { EstimatedL1Fee } from "src/domain";
import SelectedAccount from "src/views/transactions/components/selected-account/selected-account.view";
import DepositAlert from "src/views/transactions/deposit/components/deposit-alert/deposit-alert.view";
import Fee from "src/views/transactions/components/fee/fee.view";
import { AmountInputChangeEventData } from "src/views/shared/amount-input/amount-input.view";
import TransactionAmountInput from "src/views/transactions/components/transaction-amount-input/transaction-amount-input.view";
import PrimaryButton from "src/views/shared/primary-button/primary-button.view";

export interface TxData {
  amount: BigNumber;
  from: EthereumAccount;
}

interface DepositFormStateProps {
  account: EthereumAccount;
  estimatedDepositFeeTask: AsyncTask<EstimatedL1Fee, Error>;
  preferredCurrency: string;
  fiatExchangeRatesTask: AsyncTask<FiatExchangeRates, string>;
}

interface DepositFormHandlerProps {
  onGoToChooseAccountStep: () => void;
  onSubmit: (txData: TxData) => void;
}

type DepositFormProps = DepositFormStateProps & DepositFormHandlerProps;

const DepositForm: React.FC<DepositFormProps> = ({
  account,
  estimatedDepositFeeTask,
  preferredCurrency,
  fiatExchangeRatesTask,
  onGoToChooseAccountStep,
  onSubmit,
}) => {
  const classes = useDepositFormStyles();
  const [amount, setAmount] = React.useState(BigNumber.from(0));
  const [isAmountValid, setIsAmountValid] = React.useState(false);
  const [showInFiat, setShowInFiat] = React.useState(false);
  const [areFundsExceededDueToFee, setAreFundsExceededDueToFee] = React.useState(false);
  const isSubmitButtonDisabled = !isAmountValid || areFundsExceededDueToFee;

  function handleAmountChange(data: AmountInputChangeEventData) {
    setShowInFiat(data.showInFiat);
    setAmount(data.amount.tokens);
    setIsAmountValid(!data.isInvalid);
    setAreFundsExceededDueToFee(data.areFundsExceededDueToFee);
  }

  function handleFormSubmission() {
    onSubmit({
      amount,
      from: account,
    });
  }

  return (
    <FormContainer>
      <SelectedAccount
        txType={TxType.Deposit}
        account={account}
        preferredCurrency={preferredCurrency}
        showInFiat={showInFiat}
        fiatExchangeRatesTask={fiatExchangeRatesTask}
        onClick={onGoToChooseAccountStep}
      />
      {areFundsExceededDueToFee && (
        <DepositAlert
          estimatedDepositFeeTask={estimatedDepositFeeTask}
          preferredCurrency={preferredCurrency}
          fiatExchangeRatesTask={fiatExchangeRatesTask}
        />
      )}
      <form
        className={classes.form}
        onSubmit={(event) => {
          event.preventDefault();
          handleFormSubmission();
        }}
      >
        <TransactionAmountInput
          txType={TxType.Deposit}
          account={account}
          fee={
            isAsyncTaskDataAvailable(estimatedDepositFeeTask)
              ? estimatedDepositFeeTask.data.amount
              : BigNumber.from(0)
          }
          preferredCurrency={preferredCurrency}
          fiatExchangeRatesTask={fiatExchangeRatesTask}
          onChange={handleAmountChange}
        />
        <PrimaryButton type="submit" label="Continue" disabled={isSubmitButtonDisabled} />
      </form>
      <Fee
        txType={TxType.Deposit}
        estimatedDepositFeeTask={estimatedDepositFeeTask}
        amount={amount}
        token={account.token}
        showInFiat={showInFiat}
        preferredCurrency={preferredCurrency}
        fiatExchangeRatesTask={fiatExchangeRatesTask}
      />
    </FormContainer>
  );
};

export default DepositForm;
