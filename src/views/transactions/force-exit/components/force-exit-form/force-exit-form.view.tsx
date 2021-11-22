import React from "react";
import { BigNumber } from "@ethersproject/bignumber";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";

import useForceExitFormStyles from "src/views/transactions/force-exit/components/force-exit-form/force-exit-form.styles";
import { Account, FiatExchangeRates } from "src/domain/hermez";
import { AsyncTask } from "src/utils/types";
import FormContainer from "src/views/transactions/components/form-container/form.container.view";
import SelectedAccount from "src/views/transactions/components/selected-account/selected-account.view";
import { getTxFee } from "src/utils/fees";
import { AmountInputChangeEventData } from "src/views/shared/amount-input/amount-input.view";
import TransactionAmountInput from "src/views/transactions/components/transaction-amount-input/transaction-amount-input.view";
import PrimaryButton from "src/views/shared/primary-button/primary-button.view";

export interface TxData {
  amount: BigNumber;
  from: Account;
}

interface ForceExitFormStateProps {
  account: Account;
  preferredCurrency: string;
  fiatExchangeRatesTask: AsyncTask<FiatExchangeRates, string>;
}

interface ForceExitFormHandlerProps {
  onGoToChooseAccountStep: () => void;
  onSubmit: (txData: TxData) => void;
}

type ForceExitFormProps = ForceExitFormStateProps & ForceExitFormHandlerProps;

const ForceExitForm: React.FC<ForceExitFormProps> = ({
  account,
  preferredCurrency,
  fiatExchangeRatesTask,
  onGoToChooseAccountStep,
  onSubmit,
}) => {
  const classes = useForceExitFormStyles();
  const [amount, setAmount] = React.useState(BigNumber.from(0));
  const [isAmountValid, setIsAmountValid] = React.useState<boolean | undefined>(undefined);
  const [showInFiat, setShowInFiat] = React.useState(false);
  const fee = getTxFee({ txType: TxType.ForceExit });

  function isSubmitButtonDisabled() {
    if (isAmountValid === false) {
      return true;
    }

    return false;
  }

  function handleAmountChange(data: AmountInputChangeEventData) {
    setShowInFiat(data.showInFiat);
    setAmount(data.amount.tokens);
    setIsAmountValid(!data.isInvalid);
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
        txType={TxType.ForceExit}
        account={account}
        preferredCurrency={preferredCurrency}
        showInFiat={showInFiat}
        fiatExchangeRatesTask={fiatExchangeRatesTask}
        onClick={onGoToChooseAccountStep}
      />
      <form
        className={classes.form}
        onSubmit={(event) => {
          event.preventDefault();
          void handleFormSubmission();
        }}
      >
        <TransactionAmountInput
          txType={TxType.ForceExit}
          account={account}
          fee={fee}
          preferredCurrency={preferredCurrency}
          fiatExchangeRatesTask={fiatExchangeRatesTask}
          onChange={handleAmountChange}
        />
        <PrimaryButton type="submit" label="Continue" disabled={isSubmitButtonDisabled()} />
      </form>
    </FormContainer>
  );
};

export default ForceExitForm;
