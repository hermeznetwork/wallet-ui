/* eslint react/prop-types: 0 */
import React from "react";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";
import { BigNumber } from "ethers";

import useExitFormStyles from "src/views/transactions/exit/components/exit-form/exit-form.styles";
import FormContainer from "src/views/transactions/components/form-container/form.container.view";
import ExitAlert from "../exit-alert/exit-alert.view";
import { getMinimumL2Fee, getTxFee } from "src/utils/fees";
import Fee from "src/views/transactions/components/fee/fee.view";
import { Account, FiatExchangeRates, RecommendedFee, Token } from "src/domain/hermez";
import { AsyncTask } from "src/utils/types";
import { EstimatedL1Fee } from "src/domain";
import { AmountInputChangeEventData } from "src/views/shared/amount-input/amount-input.view";
import SelectedAccount from "src/views/transactions/components/selected-account/selected-account.view";
import TransactionAmountInput from "src/views/transactions/components/transaction-amount-input/transaction-amount-input.view";
import PrimaryButton from "src/views/shared/primary-button/primary-button.view";

export interface TxData {
  amount: BigNumber;
  from: Account;
  fee: BigNumber;
}

interface ExitFormStateProps {
  account: Account;
  feesTask: AsyncTask<RecommendedFee, Error>;
  estimatedWithdrawFeeTask: AsyncTask<EstimatedL1Fee, Error>;
  doesUserHaveEnoughEthForWithdraw: boolean;
  preferredCurrency: string;
  fiatExchangeRatesTask: AsyncTask<FiatExchangeRates, string>;
}

interface ExitFormHandlerProps {
  onLoadEstimatedWithdrawFee: (token: Token, amount: BigNumber) => void;
  onSubmit: (txData: TxData) => void;
}

type ExitFormProps = ExitFormStateProps & ExitFormHandlerProps;

const ExitForm: React.FC<ExitFormProps> = ({
  account,
  feesTask,
  estimatedWithdrawFeeTask,
  doesUserHaveEnoughEthForWithdraw,
  preferredCurrency,
  fiatExchangeRatesTask,
  onLoadEstimatedWithdrawFee,
  onSubmit,
}) => {
  const classes = useExitFormStyles();
  const [amount, setAmount] = React.useState(BigNumber.from(0));
  const [fee, setFee] = React.useState(BigNumber.from(0));
  const [isAmountValid, setIsAmountValid] = React.useState<boolean | undefined>(undefined);
  const [showInFiat, setShowInFiat] = React.useState(false);
  const minimumFee = getMinimumL2Fee({ txType: TxType.Exit, feesTask, token: account.token });

  function isSubmitButtonDisabled() {
    if (isAmountValid === false || !doesUserHaveEnoughEthForWithdraw) {
      return true;
    }

    return false;
  }

  function handleAmountChange(data: AmountInputChangeEventData) {
    const newFee = getTxFee({
      txType: TxType.Exit,
      amount: data.amount.tokens,
      token: account.token,
      minimumFee,
    });

    setShowInFiat(data.showInFiat);
    setAmount(data.amount.tokens);
    setIsAmountValid(!data.isInvalid);
    onLoadEstimatedWithdrawFee(account.token, amount);
    setFee(newFee);
  }

  function handleFormSubmission() {
    onSubmit({
      amount,
      from: account,
      fee,
    });
  }

  return (
    <FormContainer>
      <SelectedAccount
        transactionType={TxType.Exit}
        account={account}
        preferredCurrency={preferredCurrency}
        showInFiat={showInFiat}
        fiatExchangeRatesTask={fiatExchangeRatesTask}
      />
      {!doesUserHaveEnoughEthForWithdraw && (
        <ExitAlert estimatedWithdrawFeeTask={estimatedWithdrawFeeTask} />
      )}
      <form
        className={classes.form}
        onSubmit={(event) => {
          event.preventDefault();
          void handleFormSubmission();
        }}
      >
        <TransactionAmountInput
          txType={TxType.Exit}
          account={account}
          fee={fee}
          preferredCurrency={preferredCurrency}
          fiatExchangeRatesTask={fiatExchangeRatesTask}
          onChange={handleAmountChange}
        />
        <PrimaryButton type="submit" label="Continue" disabled={isSubmitButtonDisabled()} />
      </form>
      <Fee
        transactionType={TxType.Exit}
        amount={amount}
        fee={fee}
        estimatedWithdrawFeeTask={estimatedWithdrawFeeTask}
        token={account.token}
        showInFiat={showInFiat}
        preferredCurrency={preferredCurrency}
        fiatExchangeRatesTask={fiatExchangeRatesTask}
      />
    </FormContainer>
  );
};

export default ExitForm;
