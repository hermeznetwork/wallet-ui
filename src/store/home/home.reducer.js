const initialState = {
  accounts: [
    {
      coin: {
        id: 3,
        name: 'Some Cool Token',
        abbreviation: 'SCT',
        address: '0x6693eD78Cebf7F675808E0cCe254c099e764660d'
      },
      idx: 9034,
      amount: 44,
      nonce: 12
    }
  ]
}

function homeReducer (state = initialState, action) {
  switch (action.type) {
    default: {
      return state
    }
  }
}

export default homeReducer
