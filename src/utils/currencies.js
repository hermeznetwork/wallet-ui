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

function getTokenAmountInPreferredCurrency (
  preferredCurrency,
  amountInUSD,
  fiatExchangeRatesTask
) {
  if (!fiatExchangeRatesTask) {
    return undefined
  }

  if (preferredCurrency === CurrencySymbol.USD.code) {
    return amountInUSD
  }

  return Number(amountInUSD) * fiatExchangeRatesTask[preferredCurrency]
}

export { CurrencySymbol, getTokenAmountInPreferredCurrency }
