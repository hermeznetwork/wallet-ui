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

function getTokenFiatExchangeRate (
  tokenSymbol,
  preferredCurrency,
  usdTokenExchangeRates,
  fiatExchangeRatesTask
) {
  if (!usdTokenExchangeRates || !fiatExchangeRatesTask) {
    return undefined
  }

  const tokenRateInUSD = usdTokenExchangeRates[tokenSymbol]
  const tokenRateInPreferredCurrency = fiatExchangeRatesTask[preferredCurrency]

  return preferredCurrency === CurrencySymbol.USD.code
    ? tokenRateInUSD
    : tokenRateInPreferredCurrency
}

export { CurrencySymbol, getTokenFiatExchangeRate }
