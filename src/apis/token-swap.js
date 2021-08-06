import axios from 'axios'

const baseApiUrl = `${process.env.REACT_APP_TOKEN_SWAP_API_URL}`

/**
 * Get quotes from liquidity providers
 * @param {Object} data - There should be either amountToToken or
 * amountFromToken field in request set, not both. In first case client
 * declares the amount of token he wants to receive. In the last case, client
 *  specifies the amount he has for exchange.
 * @param {String} data.fromToken - contract address from Token that user wants to swap
 * @param {String} data.toToken - contract addres from Token that user wants to receive
 * @param {String} data.fromHezAddr - address with tokens to swap
 * @param {String} [data.amountFromToken] - amount that user wants to swap
 * @param {String} [data.amountToToken] - amount that user wants to receive
 * @returns {Array} - Quotes
 */
function getQuotes (data) {
  const str = Object.keys(data).reduce(
    (acc, curr) => `${curr}=${encodeURIComponent(data[curr])}&${acc}`, ''
  )
  return axios.get(
      `${baseApiUrl}/quotes?${str}`
  ).then(res => res.data)
}

export {
  getQuotes
}
