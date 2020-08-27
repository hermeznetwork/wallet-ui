import ethers from 'ethers'
import { keccak256 } from 'js-sha3'
import BigInt from 'big-integer'
import { getNullifier, hexToBuffer } from '../../utils/utils'
import { BabyJubWallet } from '../../utils/babyjub-wallet'
import { CliExternalOperator } from '../../utils/cli-external-operator'

import * as accountActions from './account.actions'

function fetchMetamaskWallet () {
  return async function (dispatch) {
    dispatch(accountActions.loadMetamaskWallet())
    try {
      await window.ethereum.enable()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const ethereumAddress = await signer.getAddress()
      const signature = await signer.signMessage('I accept using Metamask as a CA')
      const hashedSignature = keccak256(signature)
      const bufferSignature = hexToBuffer(hashedSignature)
      const wallet = new BabyJubWallet(bufferSignature, ethereumAddress)
      dispatch(accountActions.loadMetamaskWalletSuccess(wallet))
    } catch (error) {
      dispatch(accountActions.loadMetamaskWalletFailure(error.message))
    }
  }
}

function fetchAccountInfo (abiTokens, wallet, operatorUrl, addressRollup, abiRollup) {
  return async function (dispatch) {
    dispatch(accountActions.loadAccountInfo())
    try {
      const txsExits = []
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const walletEthAddress = wallet.ethereumAddress
      const balanceHex = await provider.getBalance(walletEthAddress)
      const balance = ethers.utils.formatEther(balanceHex)
      const apiOperator = new CliExternalOperator(operatorUrl)
      const filters = {}
      if (walletEthAddress.startsWith('0x')) {
        filters.ethAddr = walletEthAddress
      } else {
        filters.ethAddr = `0x${walletEthAddress}`
      }
      const contractRollup = new ethers.Contract(addressRollup, abiRollup, signer)
      let tokensList = {}
      let allTxs = []
      try {
        tokensList = await apiOperator.getTokensList()
      } catch (err) {
        tokensList.data = {}
      }
      try {
        allTxs = await apiOperator.getAccounts(filters)
      } catch (err) {
        allTxs.data = []
      }
      const txs = allTxs.data
      const [tokensUser, tokens, tokensArray, tokensA, tokensAArray] = await getTokensInfo(tokensList, abiTokens, wallet, signer, addressRollup)
      const [tokensR, tokensRArray] = await getTokensRollup(allTxs, tokensList)
      const tokensE = await getTokensExit(apiOperator, wallet, allTxs, contractRollup, txsExits)
      const tokensTotalNum = BigInt(tokens) + BigInt(tokensE) + BigInt(tokensR)
      const tokensTotal = tokensTotalNum.toString()
      dispatch(accountActions.loadAccountInfoSuccess(balance, tokensUser, tokens, tokensR, tokensA, tokensE, tokensTotal,
        txs, txsExits, tokensArray, tokensAArray, tokensRArray))
    } catch (error) {
      dispatch(accountActions.loadAccountInfoFailure(error))
    }
  }
}

async function getTokensInfo (tokensList, abiTokens, wallet, walletEth, addressRollup) {
  const tokensArray = []
  const tokensAArray = []
  const tokensUser = []
  let tokens = BigInt(0)
  let tokensA = BigInt(0)
  let walletEthAddress = wallet.ethereumAddress
  try {
    if (!walletEthAddress.startsWith('0x')) {
      walletEthAddress = `0x${walletEthAddress}`
    }
    for (const [tokenId, address] of Object.entries(tokensList.data)) {
      if (tokenId) {
        const contractTokens = new ethers.Contract(address, abiTokens, walletEth)
        const tokensHex = await contractTokens.balanceOf(walletEthAddress)
        const tokensAHex = await contractTokens.allowance(walletEthAddress, addressRollup)
        tokens += BigInt(tokensHex)
        if (BigInt(tokensHex) > 0) {
          tokensUser.push({ tokenId, address })
          tokensArray.push({
            coin: tokenId,
            address,
            amount: BigInt(tokensHex).toString()
          })
        }
        tokensA += BigInt(tokensAHex)
        if (BigInt(tokensAHex)) {
          tokensAArray.push({
            coin: tokenId,
            address,
            amount: BigInt(tokensAHex).toString()
          })
        }
      }
    }
    return [tokensUser, tokens.toString(), tokensArray, tokensA.toString(), tokensAArray]
  } catch (err) {
    return ['0', '0']
  }
}

function getTokensRollup (allTxs, tokensList) {
  let tokensRNum = BigInt(0)
  const tokensRArray = []
  if (allTxs.data.length !== 0) {
    for (const tx in allTxs.data) {
      if (allTxs.data[tx].amount) {
        tokensRNum += BigInt(allTxs.data[tx].amount)
        tokensRArray.push({
          tokenId: allTxs.data[tx].coin,
          address: tokensList.data[allTxs.data[tx].coin]
        })
      }
    }
  }
  return [tokensRNum.toString(), tokensRArray]
}

async function getTokensExit (apiOperator, wallet, allTxs, contractRollup, txsExits) {
  let tokensENum = BigInt(0)
  try {
    for (const tx in allTxs.data) {
      if (tx) {
        const { coin } = allTxs.data[tx]
        const [ax, ay] = wallet.publicKey.map((key) => key.toString(16))
        try {
          const exits = await apiOperator.getExits(coin, ax, ay)
          const batches = exits.data
          if (batches) {
            for (const batch in batches) {
              if ({}.hasOwnProperty.call(batches, batch)) {
                // eslint-disable-next-line no-await-in-loop
                const info = await apiOperator.getExitInfo(coin, ax, ay, batches[batch])
                if (info.data.found) {
                  // eslint-disable-next-line no-await-in-loop
                  const boolNullifier = await getNullifier(wallet, info, contractRollup, batches[batch])
                  if (!boolNullifier) {
                    const amount = ethers.utils.formatEther(info.data.state.amount)
                    txsExits.push({
                      coin: allTxs.data[tx].coin, batch: batches[batch], amount
                    })
                    tokensENum += BigInt(info.data.state.amount)
                  }
                }
              }
            }
          }
        } catch (err) {
          // eslint-disable-next-line no-continue
          continue
        }
      }
    }
    return tokensENum.toString()
  } catch (err) {
    return '0'
  }
}

export {
  fetchMetamaskWallet,
  fetchAccountInfo
}
