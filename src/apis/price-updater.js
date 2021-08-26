import axios from 'axios'

const baseApiUrl = `${process.env.REACT_APP_PRICE_UPDATER_API_URL}`
const apiKey = `${process.env.REACT_APP_PRICE_UPDATER_API_KEY}`
const client = axios.create({
  baseURL: baseApiUrl,
  headers: { 'X-API-KEY': apiKey }
})

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

export { getTokensPrice, getTokenPrice }
