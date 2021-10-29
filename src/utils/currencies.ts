import { getFeeValue } from "@hermeznetwork/hermezjs/src/tx-utils";
import { getTokenAmountString } from "@hermeznetwork/hermezjs/src/utils";

import { MAX_TOKEN_DECIMALS } from "src/constants";
import { FiatExchangeRates, Token } from "src/domain/hermez";

const CurrencySymbol = {
  USD: {
    symbol: "$",
    code: "USD",
  },
  EUR: {
    symbol: "€",
    code: "EUR",
  },
  CNY: {
    symbol: "¥",
    code: "CNY",
  },
  JPY: {
    symbol: "¥",
    code: "JPY",
  },
  GBP: {
    symbol: "£",
    code: "GBP",
  },
};

/**
 * Gets the string representation of a token amount with fixed decimals
 */
function getFixedTokenAmount(amount: string, decimals: number): string {
  // We can lose precision as there will never be more than MAX_DECIMALS_UNTIL_ZERO_AMOUNT significant digits
  const balanceWithDecimals = Number(amount) / Math.pow(10, decimals);

  return trimZeros(balanceWithDecimals, MAX_TOKEN_DECIMALS).toString();
}

/**
 * Converts a USD amount to the preferred currency
 */
function getAmountInPreferredCurrency(
  usdAmount: number,
  preferredCurrency: string,
  fiatExchangeRates: FiatExchangeRates
): number {
  if (preferredCurrency === CurrencySymbol.USD.code) {
    return usdAmount;
  }

  return usdAmount * fiatExchangeRates[preferredCurrency];
}

/**
 * Converts a token amount to a new amount but in the user preferred currency
 */
function getTokenAmountInPreferredCurrency(
  amount: string,
  usdTokenExchangeRate: number,
  preferredCurrency: string,
  fiatExchangeRates: FiatExchangeRates
): number {
  const usdAmount = Number(amount) * usdTokenExchangeRate;
  return getAmountInPreferredCurrency(usdAmount, preferredCurrency, fiatExchangeRates);
}

/**
 * Converts a fee index to USD
 */
function getFeeInUsd(feeIndex: number, amount: string, token: Token): number {
  const feeInToken = Number(getTokenAmountString(getFeeValue(feeIndex, amount), token.decimals));
  const feeInFiat = feeInToken * token.USD;
  return feeInFiat;
}

/**
 * Convert token amount to preferred currency
 */
function convertTokenAmountToFiat(
  tokenAmount: string,
  token: Token,
  preferredCurrency: string,
  fiatExchangeRates: FiatExchangeRates
): number {
  const fixedTokenAmount = getFixedTokenAmount(tokenAmount, token.decimals);
  return getTokenAmountInPreferredCurrency(
    fixedTokenAmount,
    token.USD,
    preferredCurrency,
    fiatExchangeRates
  );
}

/**
 * Trim leading and trailing zeros
 */
function trimZeros(amount: number, decimals: number): number {
  return Number(amount.toFixed(decimals));
}

export {
  CurrencySymbol,
  getFixedTokenAmount,
  getAmountInPreferredCurrency,
  getTokenAmountInPreferredCurrency,
  getFeeInUsd,
  convertTokenAmountToFiat,
  trimZeros,
};
