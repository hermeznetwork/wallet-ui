import { ethers } from 'ethers'
import hermezjs from '@hermeznetwork/hermezjs'

import { ETHER_TOKEN_ID } from '../constants'

/**
 * Fetches token balances in the user's MetaMask account. Only for those tokens registered in Hermez and Ether.
 * Throws an error if the user has no balances for any registered token in Hermez or an error comes up from fetching the balances on-chain.
 *
 * @param {Object[]} hermezTokens - List of registered tokens in Hermez
 * @returns {Promise} - Array of { balance, token } where balance is a Number and token is the Token schema returned from the API.
 */
async function getTokens (wallet, hermezTokens) {
  if (wallet) {
    const provider = hermezjs.Providers.getProvider()
    const ethereumAddress = hermezjs.Addresses.getEthereumAddress(wallet.hermezEthereumAddress)
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
    const balancePromises = hermezTokens.map(token => {
      if (token.id === ETHER_TOKEN_ID) {
        // tokenID 0 is for Ether
        return provider.getBalance(ethereumAddress)
      } else {
        // For ERC 20 tokens, check the balance from the smart contract
        const contract = new ethers.Contract(token.ethereumAddress, partialERC20ABI, provider)

        return contract.balanceOf(ethereumAddress)
          // We can ignore if a call to the contract of a specific token fails.
          .catch(() => {})
      }
    })
    const balances = (await Promise.all(balancePromises))
      .map((tokenBalance, index) => {
        const tokenData = hermezTokens[index]

        return {
          balance: tokenBalance,
          token: tokenData
        }
      })
      .filter((account) => account.balance > 0)

    return balances
  } else {
    throw Error('MetaMask wallet has not loaded')
  }
}

export {
  getTokens
}
