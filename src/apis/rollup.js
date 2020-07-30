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

mock.onGet(`${baseApiUrl}/account/${mockedEthereumAddress}/txs`)
  .reply(
    200,
    [
      {
        ID: 'b89eaac7e61417341b710b727768294d0e6a277b',
        FromEthAddr: '0xaa942cfcd25ad4d90a62358b0dd84f33b398262a',
        ToEthAddr: '0xaa942cfcd25ad4d90a62358b0dd84f33b398262a',
        FromIdx: 10,
        ToIdx: 20,
        Amount: 44.12,
        Nonce: 0,
        FeeSelector: 15,
        Type: 'Transfer',
        Token: {
          ID: 3,
          Addr: 'Some Cool Token',
          Symbol: 'SCT'
        }
      }
    ]
  )

async function getAccounts (ethereumAddress) {
  const response = await axios.get(`${baseApiUrl}/account/${ethereumAddress}`)

  return response.data
}

async function getTransactions (ethereumAddress) {
  const response = await axios.get(`${baseApiUrl}/account/${ethereumAddress}/txs`)

  return response.data
}

export { getAccounts, getTransactions }
