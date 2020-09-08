import ethers from 'ethers'

import * as depositActions from './deposit.actions'

/**
 * Fetches token balances in the user's MetaMask account,
 * but only for those tokens registered in Hermez.
 */
function fetchMetaMaskTokens () {
  return async function (dispatch, getState) {
    dispatch(depositActions.loadMetaMaskTokens())
    const state = getState()
    const { metaMaskWalletTask } = state.account
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const { tokensTask } = state.global
    const partialERC20ABI = [{
      constant: true,
      inputs: [
        {
          name: '_owner',
          type: 'address'
        }
      ],
      name: 'balanceOf',
      outputs: [
        {
          name: 'balance',
          type: 'uint256'
        }
      ],
      payable: false,
      type: 'function'
    }]
    const balancePromises = []
    for (const token of tokensTask.data) {
      const contract = new ethers.Contract(token.ethAddr, partialERC20ABI, provider)
      balancePromises.push(
        contract.balanceOf(metaMaskWalletTask.data.ethereumAddress)
          // We can ignore if a call to the contract of a specific token fails.
          .catch(() => {})
      )
    }
    try {
      const balances = (await Promise.all(balancePromises))
        .filter((tokenBalance) => Number(tokenBalance) > 0)
        .map((tokenBalance, index) => {
          const tokenData = tokensTask.data[index]
          return {
            balance: Number(tokenBalance) / (Math.pow(10, tokenData.decimals)),
            ...tokenData
          }
        })
      dispatch(depositActions.loadMetaMaskTokensSuccess(balances))
    } catch (error) {
      dispatch(depositActions.loadMetaMaskTokensFailure(error))
    }
  }
}

export {
  fetchMetaMaskTokens
}
