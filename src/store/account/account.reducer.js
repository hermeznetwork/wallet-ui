const initialAccountState = {
  ethereumAddress: '0xaa942cfcd25ad4d90a62358b0dd84f33b398262a',
  defaultCurrency: 'ETH',
  preferredFiatCurrency: 'USD'
}

function accountReducer (state = initialAccountState, action) {
  switch (action.type) {
    default: {
      return state
    }
  }
}

export default accountReducer
