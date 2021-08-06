import axios from 'axios'

const baseApiUrl = `${process.env.REACT_APP_TOKEN_SWAP_API_URL}`

/**
 * Get quotes from liquidity providers
 * @param {Object} params - There should be either amountToToken or
 * amountFromToken field in request set, not both. In first case client
 * declares the amount of token he wants to receive. In the last case, client
 *  specifies the amount he has for exchange.
 * @param {String} params.fromToken - contract address from Token that user wants to swap
 * @param {String} params.toToken - contract addres from Token that user wants to receive
 * @param {String} params.fromHezAddr - address with tokens to swap
 * @param {String} [params.amountFromToken] - amount that user wants to swap
 * @param {String} [params.amountToToken] - amount that user wants to receive
 * @returns {Array} - Quotes
 */
function getQuotes (params) {
  return axios.get(
      `${baseApiUrl}/quotes`,
      { params }
  ).then(res => res.data)
}

export {
  getQuotes
}
