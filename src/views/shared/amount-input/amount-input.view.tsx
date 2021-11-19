import React from "react";
import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";

// constants
import { MAX_TOKEN_DECIMALS } from "src/constants";
// domain
import { Account, EthereumAccount, FiatExchangeRates } from "src/domain/hermez";
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
import { AsyncTask, isAsyncTaskCompleted } from "src/utils/types";

export interface Amount {
  tokens: BigNumber;
  fiat: number;
}

export interface AmountInputChangeEventData {
  amount: Amount;
  showInFiat: boolean;
  isInvalid: boolean;
  areFundsExceededDueToFee: boolean;
  isDirty: boolean;
}

interface AmountInputProps {
  txType: TxType.Deposit | TxType.Transfer | TxType.Exit | TxType.ForceExit;
  account: Account | EthereumAccount;
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
    const [areFundsExceededDueToFee, setAreFundsExceededDueToFee] = React.useState(false);
    const [isAmountCompressedInvalid, setIsAmountCompressedInvalid] = React.useState(false);
    const [isDirty, setIsDirty] = React.useState(false);

    const { txType, account, fee, fiatExchangeRatesTask, preferredCurrency, onChange } = props;

    React.useEffect(() => {
      if (onChange) {
        const isInvalid =
          isAmountNegative ||
          isAmountWithFeeMoreThanFunds ||
          isAmountCompressedInvalid ||
          areFundsExceededDueToFee;

        onChange({
          amount,
          showInFiat,
          isInvalid,
          areFundsExceededDueToFee,
          isDirty,
        });
      }
    }, [
      isAmountNegative,
      isAmountWithFeeMoreThanFunds,
      isAmountCompressedInvalid,
      areFundsExceededDueToFee,
      amount,
      showInFiat,
      isDirty,
      onChange,
    ]);

    /**
     * Converts an amount in tokens to fiat. It takes into account the prefered currency
     * of the user.
     */
    function convertAmountToFiat(tokensAmount: BigNumber) {
      if (!isAsyncTaskCompleted(fiatExchangeRatesTask)) {
        return 0;
      }

      const fixedTokenAmount = getFixedTokenAmount(tokensAmount.toString(), account.token.decimals);

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
      const tokensAmount = fiatAmount / account.token.USD;

      return parseUnits(tokensAmount.toFixed(account.token.decimals), account.token.decimals);
    }

    /**
     * Validates the new amount introduced by the user. It checks:
     * 1. The amount is not negative.
     * 2. The amount + fees doesn't exceed the account balance.
     * 3. The amount is supported by Hermez.
     * @param {BigNumber} newAmount - New amount to be checked.
     */
    function checkAmountValidity(newAmount: BigNumber) {
      setIsDirty(true);
      const newAmountWithFee = newAmount.add(fee);
      const isNewAmountWithFeeMoreThanFunds = newAmountWithFee.gt(BigNumber.from(account.balance));

      setIsAmountNegative(newAmount.lte(BigNumber.from(0)));
      setIsAmountWithFeeMoreThanFunds(isNewAmountWithFeeMoreThanFunds);
      setAreFundsExceededDueToFee(
        isNewAmountWithFeeMoreThanFunds && newAmount.lte(BigNumber.from(account.balance))
      );
      if (txType !== TxType.Deposit && txType !== TxType.ForceExit) {
        setIsAmountCompressedInvalid(isTransactionAmountCompressedValid(newAmount) === false);
      }
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

          setAmount({ tokens: fixedAmountInTokens, fiat: newAmountInFiat });
          checkAmountValidity(fixedAmountInTokens);
          setValue(event.target.value);
        } else {
          try {
            const tokensValue = event.target.value.length > 0 ? event.target.value : "0";
            const newAmountInTokens = parseUnits(tokensValue, account.token.decimals);
            const newAmountInFiat = convertAmountToFiat(newAmountInTokens);

            setAmount({ tokens: newAmountInTokens, fiat: newAmountInFiat });
            checkAmountValidity(newAmountInTokens);
            setValue(event.target.value);
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

      if (showInFiat) {
        setValue(maxAmountWithoutFeeInFiat.toString());
      } else {
        const newValue = getFixedTokenAmount(
          maxAmountWithoutFee.toString(),
          account.token.decimals
        );

        setValue(newValue);
      }

      setAmount({ tokens: maxAmountWithoutFee, fiat: maxAmountWithoutFeeInFiat });
      checkAmountValidity(maxAmountWithoutFee);
    }

    /**
     * Handles the change between tokens and fiat. It will update the value of the input
     * with the appropiate value (fiat if the previous value was tokens or tokens if the
     * previous value was fiat).
     */
    function handleSwapCurrency() {
      const newValue = showInFiat
        ? getFixedTokenAmount(amount.tokens.toString(), account.token.decimals)
        : amount.fiat.toString();

      if (value.length > 0) {
        setValue(newValue);
      }

      setShowInFiat(!showInFiat);
    }

    return (
      <WrappedComponent
        value={value}
        amount={amount}
        showInFiat={showInFiat}
        isAmountNegative={isAmountNegative}
        isAmountWithFeeMoreThanFunds={isAmountWithFeeMoreThanFunds}
        isAmountCompressedInvalid={isAmountCompressedInvalid}
        onInputChange={handleInputChange}
        onSendAll={handleSendAll}
        onSwapCurrency={handleSwapCurrency}
        {...props}
      />
    );
  };
}

export default AmountInput;
