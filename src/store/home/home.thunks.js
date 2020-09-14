import * as homeActions from './home.actions'
import * as rollupApi from '../../apis/rollup'

function fetchAccounts (ethereumAddress, tokens) {
  return (dispatch) => {
    dispatch(homeActions.loadAccounts())

    return rollupApi.getAccounts(ethereumAddress)
      .then(res => {
        const accountsWithTokenData = res.map(account => ({
          ...account,
          token: tokens.find((token) => token.tokenId === account.tokenId)
        }))

        dispatch(homeActions.loadAccountsSuccess(accountsWithTokenData))
      })
      .catch(err => dispatch(homeActions.loadAccountsFailure(err)))
  }
}

export { fetchAccounts }
