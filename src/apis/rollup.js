import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

const mock = new MockAdapter(axios)
const mockedEthereumAddress = '0xaa942cfcd25ad4d90a62358b0dd84f33b398262a'
const baseApiUrl = process.env.REACT_APP_ROLLUP_API_URL

mock.onGet(`${baseApiUrl}/account/${mockedEthereumAddress}`)
  .reply(
    200,
    [
      {
        EthAddr: '0xaa942cfcd25ad4d90a62358b0dd84f33b398262a',
        Token: {
          ID: 3,
          Symbol: 'SCT'
        },
        Balance: 2.38
      }
    ]
  )

async function getAccounts (ethereumAddress) {
  const response = await axios.get(`${baseApiUrl}/account/${ethereumAddress}`)

  return response.data
}

export { getAccounts }
