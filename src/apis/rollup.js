import axios from './mock'

const baseApiUrl = process.env.REACT_APP_ROLLUP_API_URL

async function getAccounts (ethereumAddress) {
  const response = await axios.get(`${baseApiUrl}/account/${ethereumAddress}`)

  return response.data
}

async function getAccount (ethereumAddress, tokenId) {
  const response = await axios.get(`${baseApiUrl}/account/${ethereumAddress}/${tokenId}`)

  return response.data
}

async function getTransactions (ethereumAddress, tokenId) {
  const params = {
    ...(tokenId ? { tokenId } : {})
  }
  const response = await axios.get(
    `${baseApiUrl}/account/${ethereumAddress}/txs/history`,
    { params }
  )

  return response.data
}

async function getHistoryTransaction (transactionId) {
  const response = await axios.get(`${baseApiUrl}/tx/history/${transactionId}`)

  return response.data
}

async function getPoolTransaction (transactionId) {
  const response = await axios.get(`${baseApiUrl}/tx/pool/${transactionId}`)

  return response.data
}

async function getTokens () {
  const response = await axios.get(`${baseApiUrl}/tokens`)

  return response.data
}

export {
  getAccounts,
  getAccount,
  getTransactions,
  getHistoryTransaction,
  getPoolTransaction,
  getTokens
}
