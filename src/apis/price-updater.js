import axios from 'axios'

import { CurrencySymbol } from '../utils/currencies'

const baseApiUrl = `${process.env.REACT_APP_PRICE_UPDATER_API_URL}`
const apiKey = `${process.env.REACT_APP_PRICE_UPDATER_API_KEY}`
const client = axios.create({
  baseURL: baseApiUrl,
  headers: { 'X-API-KEY': apiKey }
})

const mockedFiatExchangeRates = {
  EUR: 0.837775,
  CNY: 6.446304,
  JPY: 110.253954,
  GBP: 0.716945
}

/**
 * Returns a list of tokens prices.
 * @returns {Object} - List of tokens
 */
function getTokensPrice () {
  return client.get(`${baseApiUrl}/v1/tokens`)
    .then(({ data }) => {
      console.log(data)
      return data
    })
}

/**
 * Fetches the USD exchange rates for the requested currency symbols
 * @param {string[]} tokenId - ISO 4217 currency codes
 * @returns {Object} - USD exchange rates for the requested symbols
 */
function getTokenPrice (tokenId) {
  return client.get(`${baseApiUrl}/v1/tokens/${tokenId}`)
    .then(({ data }) => {
      console.log(data)
      return data
    })
}

/**
 * Fetches the USD exchange rates for the requested currency symbols
 * @param {string[]} symbols - ISO 4217 currency codes
 * @returns {Object} - USD exchange rates for the requested symbols
 */
// eslint-disable-next-line no-unused-vars
function getFiatExchangeRates (symbols) {
  const params = { base: CurrencySymbol.USD.code, symbols: symbols.join('|') }

  return client.get(`${baseApiUrl}/v1/currencies`, { params })
    .then((res) => {
      return res.data.currencies.reduce((acc, rate) => ({
        ...acc,
        [rate.currency]: rate.price
      }), {})
    })
}

export {
  mockedFiatExchangeRates,
  getFiatExchangeRates,
  getTokensPrice,
  getTokenPrice
}
