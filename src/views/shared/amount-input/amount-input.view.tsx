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
  formatFiatAmount,
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
  fiat?: number;
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

    function updateAmountState({ tokens, fiat }: Amount, showInFiat: boolean, inputValue?: string) {
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

      if (inputValue !== undefined) {
        setValue(inputValue);
      }
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
      const decimals = account.token.decimals || MAX_TOKEN_DECIMALS;
      const regexToken = `^\\d*(?:\\.\\d{0,${decimals}})?$`;
      const regexFiat = `^\\d*(?:\\.\\d{0,2})?$`;
      const INPUT_REGEX = new RegExp(showInFiat ? regexFiat : regexToken);

      if (INPUT_REGEX.test(event.target.value)) {
        try {
          if (showInFiat) {
            const newAmountInFiat = Number(event.target.value);
            const newAmountInTokens = convertAmountToTokens(newAmountInFiat);
            const fixedAmountInTokens = fixTransactionAmount(newAmountInTokens);

            updateAmountState(
              { tokens: fixedAmountInTokens, fiat: newAmountInFiat },
              showInFiat,
              event.target.value
            );
          } else {
            const tokensValue = event.target.value.length > 0 ? event.target.value : "0";
            const newAmountInTokens = parseUnits(tokensValue, account.token.decimals);
            const newAmountInFiat = convertAmountToFiat(newAmountInTokens);

            updateAmountState(
              { tokens: newAmountInTokens, fiat: newAmountInFiat },
              showInFiat,
              event.target.value
            );
          }
        } catch (err) {
          console.log(err);
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
      const maxAmountWithoutFeeInFiat = convertAmountToFiat(maxAmountWithoutFee);
      const fixedMaxAmountWithoutFeeInFiat = maxAmountWithoutFeeInFiat
        ? trimZeros(maxAmountWithoutFeeInFiat, 2).toString()
        : undefined;
      const newValue = showInFiat
        ? fixedMaxAmountWithoutFeeInFiat
        : getFixedTokenAmount(maxAmountWithoutFee.toString(), account.token.decimals);

      updateAmountState(
        { tokens: maxAmountWithoutFee, fiat: maxAmountWithoutFeeInFiat },
        showInFiat,
        newValue
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
        ? formatFiatAmount(amount.fiat)
        : getFixedTokenAmount(amount.tokens.toString(), account.token.decimals);

      // We don't want to update the value to a 0 when the input hasn't been touched yet
      updateAmountState(amount, newShowInFiat, value.length > 0 ? newValue : undefined);
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
