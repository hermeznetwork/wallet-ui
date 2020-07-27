export const homeActionTypes = {
  LOAD_COINS_BALANCE: '[HOME] LOAD COINS BALANCE',
  LOAD_COINS_BALANCE_SUCCESS: '[HOME] LOAD COINS BALANCE SUCCESS',
  LOAD_COINS_BALANCE_FAILURE: '[HOME] LOAD COINS BALANCE FAILURE'
}

function loadCoinsBalance () {
  return {
    type: homeActionTypes.LOAD_COINS_BALANCE
  }
}

function loadCoinsBalanceSuccess (coinsBalance) {
  return {
    type: homeActionTypes.LOAD_COINS_BALANCE_SUCCESS,
    coinsBalance
  }
}

function loadCoinsBalanceFailure () {
  return {
    type: homeActionTypes.LOAD_COINS_BALANCE_FAILURE
  }
}

export {
  loadCoinsBalance,
  loadCoinsBalanceSuccess,
  loadCoinsBalanceFailure
}
