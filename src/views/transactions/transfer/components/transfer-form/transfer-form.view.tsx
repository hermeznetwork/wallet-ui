import React from "react";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";
import { BigNumber } from "@ethersproject/bignumber";

import useTransferFormStyles from "src/views/transactions/transfer/components/transfer-form/transfer-form.styles";
import { FiatExchangeRates, HermezAccount, RecommendedFee } from "src/domain/hermez";
import FormContainer from "src/views/transactions/components/form-container/form.container.view";
import { AsyncTask } from "src/utils/types";
import ReceiverInput, {
  ReceiverInputChangeEventData,
} from "src/views/transactions/transfer/components/receiver-input/receiver-input.view";
import Fee from "src/views/transactions/components/fee/fee.view";
import { getMinimumL2Fee, getTxFee } from "src/utils/fees";
import SelectedAccount from "src/views/transactions/components/selected-account/selected-account.view";
import { AmountInputChangeEventData } from "src/views/shared/amount-input/amount-input.view";
import TransactionAmountInput from "src/views/transactions/components/transaction-amount-input/transaction-amount-input.view";
import PrimaryButton from "src/views/shared/primary-button/primary-button.view";

export interface TxData {
  amount: BigNumber;
  from: HermezAccount;
  to: string;
  feesTask: AsyncTask<RecommendedFee, Error>;
}

interface TransferFormStateProps {
  account: HermezAccount;
  defaultReceiverAddress?: string;
  doesReceiverApprovedAccountsCreation?: boolean;
  feesTask: AsyncTask<RecommendedFee, Error>;
  preferredCurrency: string;
  fiatExchangeRatesTask: AsyncTask<FiatExchangeRates, string>;
}

interface TransferFormHandlerProps {
  onGoToChooseAccountStep: () => void;
  onSubmit: (txData: TxData) => void;
}

type TransferFormProps = TransferFormStateProps & TransferFormHandlerProps;

const TransferForm: React.FC<TransferFormProps> = ({
  account,
  defaultReceiverAddress,
  doesReceiverApprovedAccountsCreation,
  feesTask,
  preferredCurrency,
  fiatExchangeRatesTask,
  onGoToChooseAccountStep,
  onSubmit,
}) => {
  const classes = useTransferFormStyles();
  const [amount, setAmount] = React.useState(BigNumber.from(0));
  const [isAmountValid, setIsAmountValid] = React.useState<boolean | undefined>(undefined);
  const [fee, setFee] = React.useState(BigNumber.from(0));
  const [receiverAddress, setReceiverAddress] = React.useState("");
  const [isReceiverValid, setIsReceiverValid] = React.useState<boolean | undefined>();
  const [showInFiat, setShowInFiat] = React.useState(false);
  const minimumFee = getMinimumL2Fee({
    txType: TxType.Transfer,
    receiverAddress,
    feesTask,
    token: account.token,
    doesAccountAlreadyExist: false,
  });

  function isSubmitButtonDisabled() {
    return !isAmountValid || !isReceiverValid || doesReceiverApprovedAccountsCreation === false;
  }

  function handleAmountChange(data: AmountInputChangeEventData) {
    const newFee = getTxFee({
      txType: TxType.Transfer,
      amount: data.amount.tokens,
      token: account.token,
      minimumFee,
    });

    setShowInFiat(data.showInFiat);
    setAmount(data.amount.tokens);
    setIsAmountValid(!data.isInvalid);
    setFee(newFee);
  }

  function handleReceiverInputChange(data: ReceiverInputChangeEventData) {
    setReceiverAddress(data.value);
    setIsReceiverValid(data.isValid);
  }

  function handleFormSubmission() {
    onSubmit({
      amount,
      from: account,
      to: receiverAddress,
      feesTask: feesTask,
    });
  }

  return (
    <FormContainer>
      <SelectedAccount
        txType={TxType.Transfer}
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
          handleFormSubmission();
        }}
      >
        <TransactionAmountInput
          txType={TxType.Transfer}
          account={account}
          fee={minimumFee}
          preferredCurrency={preferredCurrency}
          fiatExchangeRatesTask={fiatExchangeRatesTask}
          onChange={handleAmountChange}
        />
        <ReceiverInput
          defaultValue={defaultReceiverAddress}
          doesReceiverApprovedAccountsCreation={doesReceiverApprovedAccountsCreation}
          onChange={handleReceiverInputChange}
        />
        <PrimaryButton type="submit" label="Continue" disabled={isSubmitButtonDisabled()} />
      </form>
      <Fee
        txType={TxType.Transfer}
        amount={amount}
        fee={fee}
        token={account.token}
        showInFiat={showInFiat}
        preferredCurrency={preferredCurrency}
        fiatExchangeRatesTask={fiatExchangeRatesTask}
      />
    </FormContainer>
  );
};

export default TransferForm;
