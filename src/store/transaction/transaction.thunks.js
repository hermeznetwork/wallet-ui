import ethers from 'ethers'
import { CoordinatorAPI } from 'hermezjs'
import { getEthereumAddress } from 'hermezjs/src/addresses'

import * as transactionActions from './transaction.actions'
import { ETHER_TOKEN_ID } from '../../constants'

/**
 * Fetches all registered tokens in Hermez.
 */
function fetchTokens () {
  return (dispatch) => {
    dispatch(transactionActions.loadTokens())

    return CoordinatorAPI.getTokens()
      .then(res => dispatch(transactionActions.loadTokensSuccess(res)))
      .catch(err => dispatch(transactionActions.loadTokensFailure(err)))
  }
}

/**
 * Fetches token balances in the user's MetaMask account. Only for those tokens registered in Hermez and Ether.
 * Dispatch an array of { balance, token } where balance is a Number and token is the Token schema returned from the API.
 * Dispatch an error if the user has no balances for any registered token in Hermez or an error comes up from fetching the balances on-chain.
 *
 * @param {Array} hermezTokens - List of registered tokens in Hermez
 */
function fetchMetaMaskTokens (hermezTokens) {
  return async function (dispatch, getState) {
    dispatch(transactionActions.loadMetaMaskTokens())
    const { global: { metaMaskWalletTask } } = getState()

    if (metaMaskWalletTask.status === 'successful') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
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
      for (const token of hermezTokens) {
        if (token.id === ETHER_TOKEN_ID) {
          // tokenID 0 is for Ether
          const signer = provider.getSigner()
          balancePromises.push(
            signer.getBalance()
          )
        } else {
          // For ERC 20 tokens, check the balance from the smart contract
          const contract = new ethers.Contract(token.ethereumAddress, partialERC20ABI, provider)
          balancePromises.push(
            contract.balanceOf(getEthereumAddress(metaMaskWalletTask.data.hermezEthereumAddress))
              // We can ignore if a call to the contract of a specific token fails.
              .catch(() => {})
          )
        }
      }

      try {
        const balances = (await Promise.all(balancePromises))
          .map((tokenBalance, index) => {
            const tokenData = hermezTokens[index]
            return {
              balance: tokenBalance,
              token: tokenData
            }
          })
          .filter((account) => account.balance > 0)

        if (balances.length === 0) {
          dispatch(transactionActions.loadMetaMaskTokensFailure('You don\'t have any ERC 20 tokens in your MetaMask account that are registered in Hermez.'))
        } else {
          dispatch(transactionActions.loadMetaMaskTokensSuccess(balances))
        }
      } catch (error) {
        dispatch(transactionActions.loadMetaMaskTokensFailure(error))
      }
    } else {
      dispatch(transactionActions.loadMetaMaskTokensFailure('MetaMask wallet has not loaded'))
    }
  }
}

/**
 * Fetches the recommended fees from the Coordinator
 */
function fetchFees () {
  return async function (dispatch) {
    dispatch(transactionActions.loadFees())

    return CoordinatorAPI.getState()
      .then(res => dispatch(transactionActions.loadFeesSuccess(res.recommendedFee)))
      .catch(err => dispatch(transactionActions.loadFeesFailure(err)))
  }
}

function fetchExit (batchNum, accountIndex) {
  return async function (dispatch) {
    dispatch(transactionActions.loadExit())

    return CoordinatorAPI.getExit(batchNum, accountIndex)
      .then(res => dispatch(transactionActions.loadExitSuccess(res)))
      .catch(err => dispatch(transactionActions.loadExitFailure(err)))
  }
}

export {
  fetchTokens,
  fetchMetaMaskTokens,
  fetchFees,
  fetchExit
}
