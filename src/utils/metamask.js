import { ethers } from 'ethers'
import { getEthereumAddress } from '@hermeznetwork/hermezjs/src/addresses'

import { ETHER_TOKEN_ID } from '../constants'

let provider

async function getProvider () {
  if (!provider) {
    if (!window.ethereum || !window.ethereum.isMetaMask) {
      throw new Error('MetaMask provider is not available')
    }
    provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send('eth_requestAccounts')
  }

  return provider
}

/**
 * Fetches token balances in the user's MetaMask account. Only for those tokens registered in Hermez and Ether.
 * Throws an error if the user has no balances for any registered token in Hermez or an error comes up from fetching the balances on-chain.
 *
 * @param {Object[]} hermezTokens - List of registered tokens in Hermez
 * @returns {Promise} - Array of { balance, token } where balance is a Number and token is the Token schema returned from the API.
 */
async function getMetaMaskTokens (wallet, hermezTokens) {
  if (wallet) {
    const provider = await getProvider()
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
        const signer = provider.getSigner()

        return signer.getBalance()
      } else {
        // For ERC 20 tokens, check the balance from the smart contract
        const contract = new ethers.Contract(token.ethereumAddress, partialERC20ABI, provider)

        return contract.balanceOf(getEthereumAddress(wallet.hermezEthereumAddress))
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

    if (balances.length === 0) {
      throw Error('You don\'t have any ERC 20 tokens in your MetaMask account that are registered in Hermez.')
    } else {
      return balances
    }
  } else {
    throw Error('MetaMask wallet has not loaded')
  }
}

export {
  getMetaMaskTokens
}
