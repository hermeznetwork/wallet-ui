export const homeActionTypes = {
  LOAD_ACCOUNTS: '[HOME] LOAD ACCOUNTS',
  LOAD_ACCOUNTS_SUCCESS: '[HOME] LOAD ACCOUNTS SUCCESS',
  LOAD_ACCOUNTS_FAILURE: '[HOME] LOAD ACCOUNTS FAILURE',
  LOAD_TOKENS_PRICE: '[HOME] LOAD TOKENS PRICE',
  LOAD_TOKENS_PRICE_SUCCESS: '[HOME] LOAD TOKENS PRICE SUCCESS',
  LOAD_TOKENS_PRICE_FAILURE: '[HOME] LOAD TOKENS PRICE FAILURE'
}

function loadAccounts () {
  return {
    type: homeActionTypes.LOAD_ACCOUNTS
  }
}

function loadAccountsSuccess (accounts) {
  return {
    type: homeActionTypes.LOAD_ACCOUNTS_SUCCESS,
    accounts
  }
}

function loadAccountsFailure () {
  return {
    type: homeActionTypes.LOAD_ACCOUNTS_FAILURE
  }
}

function loadTokensPrice () {
  return {
    type: homeActionTypes.LOAD_TOKENS_PRICE
  }
}

function loadTokensPriceSuccess (tokensPrice) {
  return {
    type: homeActionTypes.LOAD_TOKENS_PRICE_SUCCESS,
    tokensPrice
  }
}

function loadTokensPriceFailure () {
  return {
    type: homeActionTypes.LOAD_TOKENS_PRICE_FAILURE
  }
}

export {
  loadAccounts,
  loadAccountsSuccess,
  loadAccountsFailure,
  loadTokensPrice,
  loadTokensPriceSuccess,
  loadTokensPriceFailure
}
