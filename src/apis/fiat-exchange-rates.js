import axios from 'axios'

import { CurrencySymbol } from '../utils/currencies'
import { FIAT_EXCHANGE_RATES_API_URL } from '../constants'

const baseApiUrl = FIAT_EXCHANGE_RATES_API_URL

/**
 * Fetches the USD exchange rates for the requested currency symbols
 * @param {string[]} symbols - ISO 4217 currency codes
 * @returns {Object} - USD exchange rates for the requested symbols
 */
// eslint-disable-next-line no-unused-vars
function getFiatExchangeRates (symbols) {
  const params = { base: CurrencySymbol.USD.code, symbols: symbols.join(','), access_key: process.env.REACT_APP_EXCHANGE_RATES_API_KEY }

  return axios.get(`${baseApiUrl}/latest`, { params })
    .then(res => res.data)
}

/**
 * Mocks the USD exchange rates for the requested currency symbols
 * @param {string[]} symbols - ISO 4217 currency codes
 * @returns {Object} - USD exchange rates for the requested symbols
 */
function getMockedFiatExchangeRates () {
  return Promise.resolve({
    success: true,
    base: 'USD',
    rates: {
      EUR: 0.837775,
      CNY: 6.446304,
      JPY: 110.253954,
      GBP: 0.716945
    }
  })
}

export { getMockedFiatExchangeRates as getFiatExchangeRates }
