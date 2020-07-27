const baseApiUrl = process.env.REACT_APP_ROLLUP_API_URL

async function getCoinsBalance (ethereumAddress) {
  const request = await fetch(
    `${baseApiUrl}/account/${ethereumAddress}`,
    { method: 'GET' }
  )
  const response = await request.json()

  return response
}

export { getCoinsBalance }
