import axios from 'axios'

const baseApiUrl = `${process.env.REACT_APP_TOKEN_SWAP_API_URL}`

/**
 * Get quotes from liquidity providers
 * @typedef {Object} request
 * @property {string} fromToken - contract address from Token that want to Swap
 * @property {string} toToken - contract addres from Token that want to Get
 * @property {string} fromHezAddr - address with tokens to swap
 * @prop {string} [amountFromToken] - amount that want to swap
 * @prop {string} [amountToToken] - amount that want to receive
 * @param {request} request - There should be either amountToToken or
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
