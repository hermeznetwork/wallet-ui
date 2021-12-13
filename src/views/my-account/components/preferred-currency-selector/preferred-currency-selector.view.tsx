import React from "react";

import usePreferredCurrencySelectorStyles from "./preferred-currency-selector.styles";
import clsx from "clsx";

import { Currency } from "src/utils/currencies";

interface PreferredCurrencySelectorProps {
  preferredCurrency: string;
  currencies: Currency[];
  onChange: (selectedTokenId: string) => void;
}

function PreferredCurrencySelector({
  preferredCurrency,
  currencies,
  onChange,
}: PreferredCurrencySelectorProps): JSX.Element {
  const classes = usePreferredCurrencySelectorStyles();

  /**
   * Bubbles up the preferred currency change event
   */
  function handleOnInputClick(event: React.ChangeEvent<HTMLInputElement>) {
    onChange(event.currentTarget.value);
  }

  return (
    <div className={classes.root}>
      {currencies.map((currency, index) => (
        <div key={currency.code} className={clsx({ [classes.inputGroupSpacer]: index > 0 })}>
          <input
            className={classes.input}
            type="radio"
            name="currency"
            id={currency.code}
            value={currency.code}
            checked={preferredCurrency === currency.code}
            onChange={handleOnInputClick}
          />
          <label className={classes.label} htmlFor={currency.code}>
            {currency.code}
          </label>
        </div>
      ))}
    </div>
  );
}

export default PreferredCurrencySelector;
