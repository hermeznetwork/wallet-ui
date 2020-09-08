import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

const baseRollupApiUrl = process.env.REACT_APP_ROLLUP_API_URL

const mock = new MockAdapter(axios)
const mockedTokenId = 0
const mockedHistoryTransactionId = 'b89eaac7e61417341b710b727768294d0e6a277b'

const ethAccountRegex = new RegExp(`${baseRollupApiUrl}/account/0x[a-fA-F0-9]{40}$`)
mock.onGet(ethAccountRegex)
  .reply(
    200,
    [
      {
        EthAddr: '0xaa942cfcd25ad4d90a62358b0dd84f33b398262a',
        TokenID: 0,
        Balance: 2.38
      }
    ]
  )

const tokenAccountRegex = new RegExp(`${baseRollupApiUrl}/account/0x[a-fA-F0-9]{40}/${mockedTokenId}$`)
mock.onGet(tokenAccountRegex)
  .reply(
    200,
    {
      EthAddr: '0xaa942cfcd25ad4d90a62358b0dd84f33b398262a',
      TokenID: 0,
      Balance: 44.12
    }
  )

const txsRegex = new RegExp(`${baseRollupApiUrl}/account/0x[a-fA-F0-9]{40}/txs/history$`)
mock.onGet(txsRegex)
  .reply(
    200,
    [
      {
        TxID: mockedHistoryTransactionId,
        FromEthAddr: '0xaa942cfcd25ad4d90a62358b0dd84f33b398262a',
        ToEthAddr: '0xaa942cfcd25ad4d90a62358b0dd84f33b398262a',
        FromIdx: 10,
        ToIdx: 20,
        Amount: 44.12,
        Nonce: 0,
        Fee: 15,
        Type: 'Transfer',
        TokenID: 0
      }
    ]
  )

mock.onGet(`${baseRollupApiUrl}/tx/pool/${mockedHistoryTransactionId}`).reply(404)

mock.onGet(`${baseRollupApiUrl}/tx/history/${mockedHistoryTransactionId}`)
  .reply(
    200,
    {
      TxID: mockedHistoryTransactionId,
      FromEthAddr: '0xaa942cfcd25ad4d90a62358b0dd84f33b398262a',
      ToEthAddr: '0xaa942cfcd25ad4d90a62358b0dd84f33b398262a',
      FromIdx: 10,
      ToIdx: 20,
      Amount: 44.12,
      Nonce: 0,
      Fee: 15,
      Type: 'Transfer',
      TokenID: 2
    }
  )

mock.onGet(`${baseRollupApiUrl}/tokens`)
  .reply(
    200,
    [
      {
        TokenID: 0,
        Name: 'Some Cool Token',
        Symbol: 'SCT',
        USD: 2
      },
      {
        TokenID: 1,
        Name: 'Other Cool Token',
        Symbol: 'OCT',
        USD: 2
      },
      {
        TokenID: 2,
        Name: 'New Token',
        Symbol: 'NTO',
        USD: 2
      },
      {
        TokenID: 3,
        Name: 'Too Good Token',
        Symbol: 'TGT',
        USD: 2
      }
    ]
  )

mock.onAny()
  .passThrough()

export default axios
