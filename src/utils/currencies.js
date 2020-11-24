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
  if (!amount || !decimals) {
    return undefined
  }

  // We can lose precision as there will never be more than MAX_DECIMALS_UNTIL_ZERO_AMOUNT significant digits
  const balanceWithDecimals = Number(amount) / Math.pow(10, decimals)
  const amountSignificantDigits = amount.length - 1
  const significantDigits = decimals - amountSignificantDigits

  if (significantDigits > MAX_DECIMALS_UNTIL_ZERO_AMOUNT) {
    return '0'
  }

  const significantDigitsFinal = significantDigits > 2 ? significantDigits : 2
  return balanceWithDecimals.toFixed(significantDigitsFinal)
}

/**
 * Converts a token amount to a new amount but in the user preferred currency
 *
 * @param {string} amount - The amount to be be converted
 * @param {string} usdTokenExchangeRate - Current USD exchange rate for the token
 * @param {string} preferredCurrency - User preferred currency
 * @param {string} fiatExchangeRates - Exchange rates for all the supported currencies in the app
 *
 * @returns {number}
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
  getTokenAmountInPreferredCurrency
}
