import axios from 'axios'

const baseApiUrl = process.env.REACT_APP_ROLLUP_API_URL

async function getAccounts (ethereumAddress) {
  const params = { hermezEthereumAddress: ethereumAddress }
  const response = await axios.get(`${baseApiUrl}/accounts`, { params })

  return response.data
}

async function getAccount (accountIndex) {
  const response = await axios.get(`${baseApiUrl}/account/${accountIndex}`)

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

async function getTokens (tokenIds) {
  const params = {
    ...(tokenIds ? { ids: tokenIds.join(',') } : {})
  }
  const response = await axios.get(`${baseApiUrl}/tokens`, { params })

  return response.data
}

async function getFees () {
  const response = await axios.get(`${baseApiUrl}/recommendedFee`)

  return response.data
}

export {
  getAccounts,
  getAccount,
  getTransactions,
  getHistoryTransaction,
  getPoolTransaction,
  getTokens,
  getFees
}
