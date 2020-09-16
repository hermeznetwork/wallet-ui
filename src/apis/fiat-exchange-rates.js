import axios from 'axios'

import { CurrencySymbol } from '../utils/currencies'

const baseApiUrl = process.env.REACT_APP_FIAT_EXCHANGE_RATES_API_URL

function getFiatExchangeRates (symbols) {
  const params = { base: CurrencySymbol.USD.code, symbols: symbols.join(',') }

  return axios.get(`${baseApiUrl}/latest`, { params })
    .then(res => res.data)
}

export { getFiatExchangeRates }
