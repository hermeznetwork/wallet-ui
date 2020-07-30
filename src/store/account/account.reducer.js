const initialAccountState = {
  ethereumAddress: '0xaa942cfcd25ad4d90a62358b0dd84f33b398262a',
  preferredCurrency: 'USD'
}

function accountReducer (state = initialAccountState, action) {
  switch (action.type) {
    default: {
      return state
    }
  }
}

export default accountReducer
