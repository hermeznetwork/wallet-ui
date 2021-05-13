import { ethers } from 'ethers'
import hermezjs from '@hermeznetwork/hermezjs'

import { ETHER_TOKEN_ID, DEPOSIT_TX_TIMEOUT } from '../constants'

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

/**
 * Checks if an Ethereum transaction has been canceled by the user
 * @param {Object} tx - Ethereum transaction
 * @returns {Boolean}
 */
function isTxCanceled (tx) {
  return tx === null
}

/**
 * Checks if an Ethereum transaction has been mined
 * @param {Object} tx - Ethereum transaction
 * @returns {Boolean}
 */
function isTxMined (tx) {
  return tx !== null && tx.blockNumber !== null
}

/**
 * Checks if an Ethereum transaction is expected to fail. We expect a transaction to fail
 * if it exceeds a timeout (24h by default) or if the user doesn't have enough ETH in his
 * account to pay the maximum fee estimated for the tx.
 * @param {Object} tx - Ethereum transaction
 * @param {Date} date - Date the transaction was sent
 * @param {BigInt} accountEthBalance - ETH balance of the account which the transaction has been sent from
 * @returns {Boolean}
 */
function isTxExpectedToFail (tx, date, accountEthBalance) {
  if (tx !== null && tx.blockNumber === null) {
    const maxTxFee = BigInt(tx.gasLimit) * BigInt(tx.gasPrice)

    if (Date.now() > new Date(date).getTime() + DEPOSIT_TX_TIMEOUT || maxTxFee > accountEthBalance) {
      return true
    }
  }

  return false
}

/**
 * Checks if an Ethereum transaction has been reverted
 * @param {Object} txReceipt - Ethereum transaction receipt
 * @returns {Boolean}
 */
function hasTxBeenReverted (txReceipt) {
  return txReceipt.status === 0
}

export {
  getTokens,
  isTxCanceled,
  isTxMined,
  isTxExpectedToFail,
  hasTxBeenReverted
}
