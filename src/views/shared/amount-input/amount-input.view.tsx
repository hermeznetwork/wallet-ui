import React from "react";
import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";

// constants
import { MAX_TOKEN_DECIMALS } from "src/constants";
// domain
import { Account, FiatExchangeRates } from "src/domain/hermez";
// utils
import {
  getFixedTokenAmount,
  getTokenAmountInPreferredCurrency,
  trimZeros,
} from "src/utils/currencies";
import {
  fixTransactionAmount,
  getMaxTxAmount,
  isTransactionAmountCompressedValid,
} from "src/utils/transactions";
import { AsyncTask, isAsyncTaskDataAvailable } from "src/utils/types";

export interface Amount {
  tokens: BigNumber;
  fiat: number;
}

export interface AmountInputChangeEventData {
  amount: Amount;
  showInFiat: boolean;
  isInvalid: boolean;
  areFundsExceededDueToFee: boolean;
}

interface AmountInputProps {
  txType: TxType.Deposit | TxType.Transfer | TxType.Exit | TxType.ForceExit;
  account: Account;
  fee: BigNumber;
  preferredCurrency: string;
  fiatExchangeRatesTask: AsyncTask<FiatExchangeRates, string>;
  onChange: (data: AmountInputChangeEventData) => void;
}

interface AmountInputAddedProps {
  value: string;
  amount: Amount;
  showInFiat: boolean;
  isAmountNegative: boolean;
  isAmountWithFeeMoreThanFunds: boolean;
  isAmountCompressedInvalid: boolean;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSendAll: () => void;
  onSwapCurrency: () => void;
}

export type WrappedAmountInputComponentProps = AmountInputProps & AmountInputAddedProps;

function AmountInput(
  WrappedComponent: React.ComponentType<WrappedAmountInputComponentProps>
): React.FC<AmountInputProps> {
  return function Component(props: AmountInputProps): JSX.Element {
    const [value, setValue] = React.useState("");
    const [amount, setAmount] = React.useState<Amount>({ tokens: BigNumber.from(0), fiat: 0 });
    const [showInFiat, setShowInFiat] = React.useState(false);
    const [isAmountNegative, setIsAmountNegative] = React.useState(false);
    const [isAmountWithFeeMoreThanFunds, setIsAmountWithFeeMoreThanFunds] = React.useState(false);
    const [isAmountCompressedInvalid, setIsAmountCompressedInvalid] = React.useState(false);

    const { txType, account, fee, fiatExchangeRatesTask, preferredCurrency, onChange } = props;

    /**
     * Converts an amount in tokens to fiat. It takes into account the prefered currency
     * of the user.
     */
    function convertAmountToFiat(tokenAmount: BigNumber) {
      if (!isAsyncTaskDataAvailable(fiatExchangeRatesTask)) {
        return 0;
      }

      const fixedTokenAmount = getFixedTokenAmount(tokenAmount.toString(), account.token.decimals);

      return getTokenAmountInPreferredCurrency(
        fixedTokenAmount,
        account.token.USD,
        preferredCurrency,
        fiatExchangeRatesTask.data
      );
    }

    /**
     * Converts an amount in fiat to tokens.
     */
    function convertAmountToTokens(fiatAmount: number) {
      const tokenAmount = fiatAmount / account.token.USD;

      return parseUnits(tokenAmount.toFixed(account.token.decimals), account.token.decimals);
    }

    function updateAmountState({ tokens, fiat }: Amount, inputValue: string, showInFiat: boolean) {
      const newAmountWithFee = tokens.add(fee);
      const isAmountNegative = tokens.lte(BigNumber.from(0));
      const isNewAmountWithFeeMoreThanFunds = newAmountWithFee.gt(BigNumber.from(account.balance));
      const areFundsExceededDueToFee =
        isNewAmountWithFeeMoreThanFunds && tokens.lte(BigNumber.from(account.balance));
      const isAmountCompressedInvalid =
        txType === TxType.Deposit || txType === TxType.ForceExit
          ? false
          : isTransactionAmountCompressedValid(tokens) === false;
      const isAmountInvalid =
        isAmountNegative ||
        isNewAmountWithFeeMoreThanFunds ||
        areFundsExceededDueToFee ||
        isAmountCompressedInvalid;

      setValue(inputValue);
      setAmount({ tokens, fiat });
      setIsAmountNegative(isAmountNegative);
      setIsAmountWithFeeMoreThanFunds(isNewAmountWithFeeMoreThanFunds);
      setIsAmountCompressedInvalid(isAmountCompressedInvalid);
      setShowInFiat(showInFiat);
      onChange({
        amount: { tokens, fiat },
        showInFiat,
        isInvalid: isAmountInvalid,
        areFundsExceededDueToFee,
      });
    }

    /**
     * Handles input change events. It's going to check that the input value is a valid
     * amount and calculate both the tokens and fiat amounts for a value. It will also
     * trigger the validation checks.
     */
    function handleInputChange(event: { target: { value: string } }) {
      const decimals =
        account?.token?.decimals === undefined ? MAX_TOKEN_DECIMALS : account.token.decimals;
      const regexToken = `^\\d*(?:\\.\\d{0,${decimals}})?$`;
      const regexFiat = `^\\d*(?:\\.\\d{0,2})?$`;
      const INPUT_REGEX = new RegExp(showInFiat ? regexFiat : regexToken);

      if (INPUT_REGEX.test(event.target.value)) {
        if (showInFiat) {
          const newAmountInFiat = Number(event.target.value);
          const newAmountInTokens = convertAmountToTokens(newAmountInFiat);
          const fixedAmountInTokens = fixTransactionAmount(newAmountInTokens);

          updateAmountState(
            { tokens: fixedAmountInTokens, fiat: newAmountInFiat },
            event.target.value,
            showInFiat
          );
        } else {
          try {
            const tokensValue = event.target.value.length > 0 ? event.target.value : "0";
            const newAmountInTokens = parseUnits(tokensValue, account.token.decimals);
            const newAmountInFiat = convertAmountToFiat(newAmountInTokens);

            updateAmountState(
              { tokens: newAmountInTokens, fiat: newAmountInFiat },
              event.target.value,
              showInFiat
            );
          } catch (err) {
            console.log(err);
          }
        }
      }
    }

    /**
     * Handles the "Max" button click. It will calculate the max possible amount that a
     * user can send in a transaction based on the account balance. It also takes the fee
     * into account (if applicable).
     */
    function handleSendAll() {
      const maxPossibleAmount = BigNumber.from(account.balance);
      const maxAmountWithoutFee = getMaxTxAmount(txType, maxPossibleAmount, fee);
      const maxAmountWithoutFeeInFiat = trimZeros(convertAmountToFiat(maxAmountWithoutFee), 2);
      const newValue = showInFiat
        ? maxAmountWithoutFeeInFiat.toString()
        : getFixedTokenAmount(maxAmountWithoutFee.toString(), account.token.decimals);

      updateAmountState(
        { tokens: maxAmountWithoutFee, fiat: maxAmountWithoutFeeInFiat },
        newValue,
        showInFiat
      );
    }

    /**
     * Handles the change between tokens and fiat. It will update the value of the input
     * with the appropiate value (fiat if the previous value was tokens or tokens if the
     * previous value was fiat).
     */
    function handleSwapCurrency() {
      const newShowInFiat = !showInFiat;
      const newValue = newShowInFiat
        ? amount.fiat.toString()
        : getFixedTokenAmount(amount.tokens.toString(), account.token.decimals);

      if (value.length > 0) {
        setValue(newValue);
      }

      updateAmountState(amount, newValue, newShowInFiat);
    }

    return (
      <WrappedComponent
        {...props}
        value={value}
        amount={amount}
        showInFiat={showInFiat}
        isAmountNegative={isAmountNegative}
        isAmountWithFeeMoreThanFunds={isAmountWithFeeMoreThanFunds}
        isAmountCompressedInvalid={isAmountCompressedInvalid}
        onInputChange={handleInputChange}
        onSendAll={handleSendAll}
        onSwapCurrency={handleSwapCurrency}
      />
    );
  };
}

export default AmountInput;
