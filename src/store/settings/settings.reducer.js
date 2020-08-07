const initialSettingsState = {
  ethereumAddress: '0xaa942cfcd25ad4d90a62358b0dd84f33b398262a',
  preferredCurrency: 'USD'
}

function settingsReducer (state = initialSettingsState, action) {
  switch (action.type) {
    default: {
      return state
    }
  }
}

export default settingsReducer
