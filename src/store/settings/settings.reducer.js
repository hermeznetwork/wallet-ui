const initialSettingsState = {
  ethereumAddress: '0xaa942cfcd25ad4d90a62358b0dd84f33b398262a',
  preferredCurrency: 'USD',
  // TokenID     TokenID
  // EthAddr     eth.Address
  // Name        string
  // Symbol      string
  // Decimals    uint64
  // EthTxHash   eth.Hash // Ethereum TxHash in which this token was registered
  // EthBlockNum uint64   // Ethereum block number in which this token was registered
  tokenList: [

  ]
}

function settingsReducer (state = initialSettingsState, action) {
  switch (action.type) {
    default: {
      return state
    }
  }
}

export default settingsReducer
