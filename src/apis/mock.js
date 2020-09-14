import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

const baseApiUrl = process.env.REACT_APP_ROLLUP_API_URL

const mock = new MockAdapter(axios)
const mockedTokenId = 0
const mockedHistoryTransactionId = 'b89eaac7e61417341b710b727768294d0e6a277b'

const ethAccountRegex = new RegExp(`${baseApiUrl}/account/0x[a-fA-F0-9]{40}$`)
mock.onGet(ethAccountRegex)
  .reply(
    200,
    [
      {
        ethAddr: '0xaa942cfcd25ad4d90a62358b0dd84f33b398262a',
        tokenId: 0,
        balance: 2.38
      }
    ]
  )

const tokenAccountRegex = new RegExp(`${baseApiUrl}/account/0x[a-fA-F0-9]{40}/${mockedTokenId}$`)
mock.onGet(tokenAccountRegex)
  .reply(
    200,
    {
      ethAddr: '0xaa942cfcd25ad4d90a62358b0dd84f33b398262a',
      tokenId: 0,
      balance: 2.38
    }
  )

const txsRegex = new RegExp(`${baseApiUrl}/account/0x[a-fA-F0-9]{40}/txs/history$`)
mock.onGet(txsRegex)
  .reply(
    200,
    [
      {
        txId: mockedHistoryTransactionId,
        fromEthAddr: '0xaa942cfcd25ad4d90a62358b0dd84f33b398262a',
        toEthAddr: '0xaa942cfcd25ad4d90a62358b0dd84f33b398262a',
        fromIdx: 10,
        toIdx: 20,
        amount: 44.12,
        nonce: 0,
        fee: 15,
        type: 'Transfer',
        tokenId: 0
      }
    ]
  )

mock.onGet(`${baseApiUrl}/tx/pool/${mockedHistoryTransactionId}`).reply(404)

mock.onGet(`${baseApiUrl}/tx/history/${mockedHistoryTransactionId}`)
  .reply(
    200,
    {
      txId: mockedHistoryTransactionId,
      fromEthAddr: '0xaa942cfcd25ad4d90a62358b0dd84f33b398262a',
      toEthAddr: '0xaa942cfcd25ad4d90a62358b0dd84f33b398262a',
      fromIdx: 10,
      toIdx: 20,
      amount: 44.12,
      nonce: 0,
      fee: 15,
      type: 'Transfer',
      tokenId: 0
    }
  )

mock.onGet(`${baseApiUrl}/tokens`)
  .reply(
    200,
    [
      {
        tokenId: 0,
        name: 'Aragon',
        symbol: 'ANT',
        decimals: 18,
        ethAddr: '0x960b236a07cf122663c4303350609a66a7b288c0',
        ethBlockNum: 762375478,
        USD: 2
      },
      {
        tokenId: 1,
        name: 'Maker',
        symbol: 'MKR',
        decimals: 18,
        ethAddr: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
        ethBlockNum: 762375478,
        USD: 2
      },
      {
        tokenId: 2,
        name: 'Dai',
        symbol: 'DAI',
        decimals: 18,
        ethAddr: '0x6b175474e89094c44da98b954eedeac495271d0f',
        ethBlockNum: 762375478,
        USD: 2
      },
      {
        tokenId: 3,
        name: '0x',
        symbol: 'ZRX',
        decimals: 18,
        ethAddr: '0xe41d2489571d322189246dafa5ebde1f4699f498',
        ethBlockNum: 762375478,
        USD: 2
      },
      {
        tokenId: 4,
        name: 'Goerli Test Token',
        symbol: 'TNT',
        decimals: 18,
        ethAddr: '0x7af963cf6d228e564e2a0aa0ddbf06210b38615d',
        ethBlockNum: 762375478
      }
    ]
  )

mock.onGet(`${baseApiUrl}/recommendedFee`)
  .reply(
    200,
    {
      existingAccount: 0.1,
      createAccount: 0.2,
      createAccountInternal: 0.15
    }
  )

mock.onAny()
  .passThrough()

export default axios
