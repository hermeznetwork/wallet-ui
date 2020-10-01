import { MAX_DECIMALS_UNTIL_ZERO_AMOUNT } from '../constants'

const CurrencySymbol = {
  USD: {
    symbol: '$',
    code: 'USD'
  },
  EUR: {
    symbol: '€',
    code: 'EUR'
  }
}

/**
 * Gets the string representation of a token amount with fixed decimals
 * @param {string} amount - Amount to be be converted in a bigint format
 * @param {number} decimals - Decimals that the amount should have in its string representation
 * @returns {string}
 */
function getFixedTokenAmount (amount, decimals) {
  const balanceWithDecimals = Number(amount) / Math.pow(10, decimals)

  if (balanceWithDecimals < 1 / (Math.pow(10, MAX_DECIMALS_UNTIL_ZERO_AMOUNT))) {
    return '0'
  }

  return balanceWithDecimals.toFixed(decimals)
}

/**
 * Converts an amount in BigInt and decimals to a Float
 *
 * @param {String} amountBigInt - String representing the amount as a BigInt with no decimals
 * @param {Number} decimals - Number of decimal points the amount actually has
 */
function getTokenAmount (amountBigInt, decimals) {
  return Number(amountBigInt) / Math.pow(10, decimals)
}

/**
 * Converts a token amount to a new amount but in the user preferred currency
 * @param {string} amount - The amount to be be converted
 * @param {string} usdTokenExchangeRate - Current USD exchange rate for the token
 * @param {string} preferredCurrency - User preferred currency
 * @param {string} fiatExchangeRates - Exchange rates for all the supported currencies in the app
 * @returns {string}
 */
function getTokenAmountInPreferredCurrency (
  amount,
  usdTokenExchangeRate,
  preferredCurrency,
  fiatExchangeRates
) {
  const usdAmount = Number(amount) * usdTokenExchangeRate

  if (!fiatExchangeRates) {
    return undefined
  }

  if (preferredCurrency === CurrencySymbol.USD.code) {
    return usdAmount
  }

  return usdAmount * fiatExchangeRates[preferredCurrency]
}

export {
  CurrencySymbol,
  getFixedTokenAmount,
  getTokenAmount,
  getTokenAmountInPreferredCurrency
}
