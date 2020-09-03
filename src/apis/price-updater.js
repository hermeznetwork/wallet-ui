import axios from './mock'

const baseApiUrl = process.env.REACT_APP_PRICE_UPDATER_API_URL

async function getTokensPrice (tokens) {
  const params = { tokens: tokens.join(',') }
  const response = await axios.get(
    `${baseApiUrl}/prices`,
    { params }
  )

  return response.data
}

export { getTokensPrice }
