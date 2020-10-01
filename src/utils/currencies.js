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

function getFixedTokenAmount (balance, decimals) {
  const balanceWithDecimals = Number(balance) / Math.pow(10, decimals)

  if (balanceWithDecimals < 10 / (Math.pow(10, 7))) {
    return '0'
  }

  return balanceWithDecimals.toFixed(decimals)
}

function getTokenAmountInPreferredCurrency (
  amount,
  usdTokenExchangeRate,
  preferredCurrency,
  fiatExchangeRatesTask
) {
  const usdAmount = Number(amount) * usdTokenExchangeRate

  if (!fiatExchangeRatesTask) {
    return undefined
  }

  if (preferredCurrency === CurrencySymbol.USD.code) {
    return usdAmount
  }

  return usdAmount * fiatExchangeRatesTask[preferredCurrency]
}

export {
  CurrencySymbol,
  getFixedTokenAmount,
  getTokenAmountInPreferredCurrency
}
