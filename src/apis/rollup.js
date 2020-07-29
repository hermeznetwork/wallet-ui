import axios from 'axios'

const baseApiUrl = process.env.REACT_APP_ROLLUP_API_URL

async function getCoinsBalance (ethereumAddress) {
  const response = await axios.get(`${baseApiUrl}/account/${ethereumAddress}`)

  return response.data
}

async function getTransactions (ethereumAddress) {
  const response = await axios.get(`${baseApiUrl}/account/${ethereumAddress}/txs`)

  return response.data
}

export { getCoinsBalance, getTransactions }
