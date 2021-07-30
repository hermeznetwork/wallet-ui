import axios from 'axios'

const baseApiUrl = `${process.env.REACT_APP_TOKEN_SWAP_API_URL}`

/**
 * Get quotes from liquidity providers
 * @param {Object} request - There should be either amountToToken or
 * amountFromToken field in request set, not both. In first case client
 * declares the amount of token he wants to get. In the last case, client
 *  specifies the amount he has for exchange.
 * @returns {Object} - Quotes
 */

function getQuotes (request) {
  return axios.post(
      `${baseApiUrl}/quotes`,
      request,
      { headers: { 'Content-Type': 'text/plain' } }
  ).then(res => res.data)
}

export {
  getQuotes
}
