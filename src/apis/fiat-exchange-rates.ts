import axios from 'axios'

import { CurrencySymbol } from '../utils/currencies'
import { FIAT_EXCHANGE_RATES_API_URL } from '../constants'

// domain
import { FiatExchangeRates, ISOStringDate } from '../domain'

export interface ApiExchangeRate {
  currency: string;
  baseCurrency: string;
  price: number;
  lastUpdate: ISOStringDate;
}

const baseApiUrl = FIAT_EXCHANGE_RATES_API_URL

const mockedFiatExchangeRates = {
  EUR: 0.837775,
  CNY: 6.446304,
  JPY: 110.253954,
  GBP: 0.716945
}

/**
 * Fetches the USD exchange rates for the requested currency symbols
 * @param {string[]} symbols - ISO 4217 currency codes
 * @returns {Promise<FiatExchangeRates>} - USD exchange rates for the requested symbols
 */
// eslint-disable-next-line no-unused-vars
function getFiatExchangeRates (symbols: string[]): Promise<FiatExchangeRates> {
  const params = { base: CurrencySymbol.USD.code, symbols: symbols.join('|') }

  return axios.get(`${baseApiUrl}/currencies`, { params })
    .then((res) => {
      const currencies: ApiExchangeRate[] = res.data.currencies;
      return currencies.reduce((acc, rate) => ({
        ...acc,
        [rate.currency]: rate.price
      }), {})
    })
}

export { mockedFiatExchangeRates, getFiatExchangeRates }
