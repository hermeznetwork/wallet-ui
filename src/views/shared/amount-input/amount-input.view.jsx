import React from "react";
import { BigNumber } from "ethers";

import { getFixedTokenAmount, getTokenAmountInPreferredCurrency } from "../../../utils/currencies";
import {
  fixTransactionAmount,
  getMaxTxAmount,
  isTransactionAmountCompressedValid,
} from "../../../utils/transactions";
import { parseUnits } from "ethers/lib/utils";
import { getTransactionFee } from "../../../utils/fees";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";
import { getProvider } from "@hermeznetwork/hermezjs/src/providers";
import { MAX_TOKEN_DECIMALS } from "../../../constants";

function AmountInput(Component) {
  return function (props) {
    const {
      defaultValue,
      transactionType,
      account,
      fee,
      fiatExchangeRates,
      preferredCurrency,
      gasPrice,
    } = props;
    const [value, setValue] = React.useState("");
    const [amount, setAmount] = React.useState({ tokens: BigNumber.from(0), fiat: 0 });
    const [showInFiat, setShowInFiat] = React.useState(false);
    const [isAmountNegative, setIsAmountNegative] = React.useState(false);
    const [isAmountWithFeeMoreThanFunds, setIsAmountWithFeeMoreThanFunds] = React.useState(false);
    const [areFundsExceededDueToFee, setAreFundsExceededDueToFee] = React.useState(false);
    const [isAmountCompressedInvalid, setIsAmountCompressedInvalid] = React.useState(false);

    React.useEffect(() => {
      handleInputChange({ target: { value: defaultValue } });
    }, [defaultValue]);

    React.useEffect(() => {
      if (props.onChange) {
        const isInvalid =
          isAmountNegative ||
          isAmountWithFeeMoreThanFunds ||
          isAmountCompressedInvalid ||
          areFundsExceededDueToFee;

        props.onChange({
          amount,
          showInFiat,
          isInvalid,
          areFundsExceededDueToFee,
        });
      }
    }, [
      amount,
      showInFiat,
      isAmountWithFeeMoreThanFunds,
      isAmountCompressedInvalid,
      areFundsExceededDueToFee,
    ]);

    /**
     * Converts an amount in tokens to fiat. It takes into account the prefered currency
     * of the user.
     * @param {BigNumber} tokensAmount - Amount to be converted to fiat
     * @returns fiatAmount
     */
    function convertAmountToFiat(tokensAmount) {
      const fixedTokenAmount = getFixedTokenAmount(tokensAmount.toString(), account.token.decimals);

      return getTokenAmountInPreferredCurrency(
        fixedTokenAmount,
        account.token.USD,
        preferredCurrency,
        fiatExchangeRates
      );
    }

    /**
     * Converts an amount in fiat to tokens.
     * @param {Number} fiatAmount - Amount to be converted to tokens
     * @returns
     */
    function convertAmountToTokens(fiatAmount) {
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
    function checkAmountValidity(newAmount) {
      const newFee = getTransactionFee(transactionType, newAmount, account.token, fee, gasPrice);
      const newAmountWithFee = newAmount.add(newFee);
      const isNewAmountWithFeeMoreThanFunds = newAmountWithFee.gt(BigNumber.from(account.balance));

      setIsAmountNegative(newAmount.lte(BigNumber.from(0)));
      setIsAmountWithFeeMoreThanFunds(isNewAmountWithFeeMoreThanFunds);
      setAreFundsExceededDueToFee(
        isNewAmountWithFeeMoreThanFunds && newAmount.lte(BigNumber.from(account.balance))
      );
      if (transactionType !== TxType.Deposit && transactionType !== TxType.ForceExit) {
        setIsAmountCompressedInvalid(isTransactionAmountCompressedValid(newAmount) === false);
      }
    }

    /**
     * Handles input change events. It's going to check that the input value is a valid
     * amount and calculate both the tokens and fiat amounts for a value. It will also
     * trigger the validation checks.
     * @param {InputEvent} event - Input event
     */
    function handleInputChange(event) {
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
          } catch (err) {}
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
      const maxAmountWithoutFee = getMaxTxAmount(
        transactionType,
        maxPossibleAmount,
        account.token,
        fee,
        gasPrice
      );
      const maxAmountWithoutFeeInFiat = convertAmountToFiat(maxAmountWithoutFee);

      if (showInFiat) {
        setValue(maxAmountWithoutFeeInFiat);
      } else {
        const newValue = getFixedTokenAmount(maxAmountWithoutFee, account.token.decimals);

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
        ? getFixedTokenAmount(amount.tokens, account.token.decimals)
        : amount.fiat;

      if (value.length > 0) {
        setValue(newValue);
      }

      setShowInFiat(!showInFiat);
    }

    return (
      <Component
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
