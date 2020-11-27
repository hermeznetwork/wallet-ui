import { ethers } from 'ethers'
import { getEthereumAddress } from 'hermezjs/src/addresses'

import { ETHER_TOKEN_ID } from '../constants'

/**
 * Fetches token balances in the user's MetaMask account. Only for those tokens registered in Hermez and Ether.
 * Throws an error if the user has no balances for any registered token in Hermez or an error comes up from fetching the balances on-chain.
 *
 * @param {Object[]} hermezTokens - List of registered tokens in Hermez
 * @returns {Promise} - Array of { balance, token } where balance is a Number and token is the Token schema returned from the API.
 */
async function getMetaMaskTokens (metaMaskWallet, finalHermezTokens) {
  // TODO: Remove once the hermez-node is ready
  const hermezTokens = [
    ...finalHermezTokens,
    {
      USD: 1.5,
      decimals: 18,
      ethereumAddress: '0xf4e77E5Da47AC3125140c470c71cBca77B5c638c',
      ethereumBlockNum: 539847538,
      fiatUpdate: null,
      id: 1,
      name: 'Token',
      symbol: 'TKN'
    },
    {
      USD: 2,
      decimals: 18,
      ethereumAddress: '0xf784709d2317D872237C4bC22f867d1BAe2913AB',
      ethereumBlockNum: 539847538,
      fiatUpdate: null,
      id: 2,
      name: 'Token 1',
      symbol: 'TKN1'
    },
    {
      USD: 350,
      decimals: 18,
      ethereumAddress: '0x0000000000000000000000000000000000000000',
      ethereumBlockNum: 539847538,
      fiatUpdate: null,
      id: 0,
      name: 'Ethereum',
      symbol: 'Eth'
    }
  ]

  if (metaMaskWallet) {
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
          contract.balanceOf(getEthereumAddress(metaMaskWallet.hermezEthereumAddress))
          // We can ignore if a call to the contract of a specific token fails.
            .catch(() => {})
        )
      }
    }

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
