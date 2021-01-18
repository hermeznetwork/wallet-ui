import axios from 'axios'

import { CurrencySymbol } from '../utils/currencies'
import { FIAT_EXCHANGE_RATES_API_URL } from '../constants'

const baseApiUrl = FIAT_EXCHANGE_RATES_API_URL

/**
 * Fetches the USD exchange rates for the requested currency symbols
 * @param {string[]} symbols - ISO 4217 currency codes
 * @returns {Object} - USD exchange rates for the requested symbols
 */
function getFiatExchangeRates (symbols) {
  const params = { base: CurrencySymbol.USD.code, symbols: symbols.join(',') }

  return axios.get(`${baseApiUrl}/latest`, { params })
    .then(res => res.data)
}

export { getFiatExchangeRates }
