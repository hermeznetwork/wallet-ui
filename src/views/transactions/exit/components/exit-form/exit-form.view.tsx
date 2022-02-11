import React from "react";
import { Enums } from "@hermeznetwork/hermezjs";
import { BigNumber } from "ethers";

import useExitFormStyles from "src/views/transactions/exit/components/exit-form/exit-form.styles";
import FormContainer from "src/views/transactions/components/form-container/form.container.view";
import ExitAlert from "../exit-alert/exit-alert.view";
import { getMinimumL2Fee, getTxFee } from "src/utils/fees";
import Fee from "src/views/transactions/components/fee/fee.view";
import { AsyncTask } from "src/utils/types";
import { AmountInputChangeEventData } from "src/views/shared/amount-input/amount-input.view";
import SelectedAccount from "src/views/transactions/components/selected-account/selected-account.view";
import TransactionAmountInput from "src/views/transactions/components/transaction-amount-input/transaction-amount-input.view";
import PrimaryButton from "src/views/shared/primary-button/primary-button.view";
// domain
import {
  EstimatedL1Fee,
  FiatExchangeRates,
  HermezAccount,
  RecommendedFee,
  Token,
} from "src/domain";

const { TxType } = Enums;

export interface TxData {
  amount: BigNumber;
  from: HermezAccount;
  fee: BigNumber;
}

interface ExitFormStateProps {
  account: HermezAccount;
  feesTask: AsyncTask<RecommendedFee, string>;
  estimatedWithdrawFeeTask: AsyncTask<EstimatedL1Fee, string>;
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
  const [isAmountValid, setIsAmountValid] = React.useState(false);
  const [showInFiat, setShowInFiat] = React.useState(false);
  const minimumFee = getMinimumL2Fee({ txType: TxType.Exit, feesTask, token: account.token });
  const isSubmitButtonDisabled = !isAmountValid || !doesUserHaveEnoughEthForWithdraw;

  React.useEffect(() => {
    onLoadEstimatedWithdrawFee(account.token, amount);
  }, [account, amount, onLoadEstimatedWithdrawFee]);

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
        txType={TxType.Exit}
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
          handleFormSubmission();
        }}
      >
        <TransactionAmountInput
          txType={TxType.Exit}
          account={account}
          fee={minimumFee}
          preferredCurrency={preferredCurrency}
          fiatExchangeRatesTask={fiatExchangeRatesTask}
          onChange={handleAmountChange}
        />
        <PrimaryButton type="submit" label="Continue" disabled={isSubmitButtonDisabled} />
      </form>
      <Fee
        txType={TxType.Exit}
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
