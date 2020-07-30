export const homeActionTypes = {
  LOAD_ACCOUNTS: '[HOME] LOAD ACCOUNTS',
  LOAD_ACCOUNTS_SUCCESS: '[HOME] LOAD ACCOUNTS SUCCESS',
  LOAD_ACCOUNTS_FAILURE: '[HOME] LOAD ACCOUNTS FAILURE'
}

function loadAccounts () {
  return {
    type: homeActionTypes.LOAD_ACCOUNTS
  }
}

function loadAccountsSuccess (accounts) {
  return {
    type: homeActionTypes.LOAD_ACCOUNTS_SUCCESS,
    accounts: accounts
  }
}

function loadAccountsFailure () {
  return {
    type: homeActionTypes.LOAD_ACCOUNTS_FAILURE
  }
}

export {
  loadAccounts,
  loadAccountsSuccess,
  loadAccountsFailure
}
