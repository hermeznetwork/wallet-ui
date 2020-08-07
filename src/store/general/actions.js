/* eslint-disable no-await-in-loop */
/* global BigInt */
import { keccak256 } from 'js-sha3'
import * as CONSTANTS from './constants'
import { getNullifier, hexToBuffer } from '../../utils/utils'
import { CliExternalOperator } from '../../utils/cli-external-operator'
import { BabyJubWallet } from '../../utils/babyjub-wallet'

const ethers = require('ethers')

function loadConfig () {
  return {
    type: CONSTANTS.LOAD_CONFIG
  }
}

function loadConfigSuccess (config, abiRollup, abiTokens, chainId, errorMessage) {
  return {
    type: CONSTANTS.LOAD_CONFIG_SUCCESS,
    payload: { config, abiRollup, abiTokens, chainId },
    error: errorMessage
  }
}

function loadConfigError (config, error) {
  return {
    type: CONSTANTS.LOAD_CONFIG_ERROR,
    payload: { config },
    error
  }
}

export function handleLoadConfig (config) {
  return async function (dispatch) {
    dispatch(loadConfig())

    try {
      let chainId
      let errorMessage = ''

      if (config.nodeEth) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const networkInfo = await provider.getNetwork()
        chainId = networkInfo.chainId
      } else {
        chainId = -1
        errorMessage = 'No Node Ethereum'
      }
      if (!config.operator) errorMessage = 'No operator'
      if (!config.address) errorMessage = 'No Rollup Address'
      if (!config.abiRollup) errorMessage = 'No Rollup ABI'
      if (!config.abiTokens) errorMessage = 'No Tokens ABI'
      if (!config.tokensAddress) errorMessage = 'No Tokens Address'

      dispatch(loadConfigSuccess(config, config.abiRollup, config.abiTokens, chainId, errorMessage))
      if (errorMessage !== '') {
        return false
      } else {
        return true
      }
    } catch (error) {
      const newConfig = config
      newConfig.nodeEth = undefined
      dispatch(loadConfigError(newConfig, 'Error Configuration'))
      return false
    }
  }
}

function loadOperator () {
  return {
    type: CONSTANTS.LOAD_OPERATOR
  }
}

function loadOperatorSuccess (apiOperator) {
  return {
    type: CONSTANTS.LOAD_OPERATOR_SUCCESS,
    payload: { apiOperator },
    error: ''
  }
}

function loadOperatorError (error) {
  return {
    type: CONSTANTS.LOAD_OPERATOR_ERROR,
    error
  }
}

export function handleLoadOperator (config) {
  return async function (dispatch) {
    dispatch(loadOperator())
    try {
      const apiOperator = new CliExternalOperator(config.operator)
      dispatch(loadOperatorSuccess(apiOperator))
    } catch (error) {
      dispatch(loadOperatorError(error))
    }
  }
}

function loadMetamask () {
  return {
    type: CONSTANTS.LOAD_METAMASK
  }
}

function loadMetamaskSuccess (metamaskWallet) {
  return {
    type: CONSTANTS.LOAD_METAMASK_SUCCESS,
    payload: { metamaskWallet },
    error: ''
  }
}

function loadMetamaskError (error) {
  return {
    type: CONSTANTS.LOAD_METAMASK_ERROR,
    error
  }
}

export function handleLoadMetamask () {
  return async function (dispatch) {
    dispatch(loadMetamask())
    try {
      await window.ethereum.enable()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const publicEthKey = await signer.getAddress()
      const signature = await signer.signMessage('I accept using Metamask as a CA')
      const hashedSignature = keccak256(signature)
      const bufferSignature = hexToBuffer(hashedSignature)
      const wallet = new BabyJubWallet(bufferSignature, publicEthKey)
      dispatch(loadMetamaskSuccess(wallet))
    } catch (error) {
      dispatch(loadMetamaskError(error.message))
    }
  }
}

function infoAccount () {
  return {
    type: CONSTANTS.INFO_ACCOUNT
  }
}

function infoAccountSuccess (balance, tokensList, tokens, tokensR, tokensA, tokensE, tokensTotal, txs,
  txsExits, tokensArray, tokensAArray, tokensRArray) {
  return {
    type: CONSTANTS.INFO_ACCOUNT_SUCCESS,
    payload: {
      balance,
      tokensList,
      tokens,
      tokensR,
      tokensA,
      tokensE,
      tokensTotal,
      txs,
      txsExits,
      tokensArray,
      tokensAArray,
      tokensRArray
    },
    error: ''
  }
}

function infoAccountError (error) {
  return {
    type: CONSTANTS.INFO_ACCOUNT_ERROR,
    error
  }
}

export function handleInfoAccount (abiTokens, wallet, operatorUrl, addressRollup, abiRollup) {
  return async function (dispatch) {
    dispatch(infoAccount())
    try {
      const txsExits = []
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const walletEthAddress = wallet.publicEthKey
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
      const [tokensUser, tokens, tokensArray, tokensA, tokensAArray] = await getTokensInfo(tokensList, abiTokens,
        wallet, signer, addressRollup)
      const [tokensR, tokensRArray] = await getTokensRollup(allTxs, tokensList)
      const tokensE = await getTokensExit(apiOperator, wallet, allTxs, contractRollup, txsExits)
      const tokensTotalNum = BigInt(tokens) + BigInt(tokensE) + BigInt(tokensR)
      const tokensTotal = tokensTotalNum.toString()
      dispatch(infoAccountSuccess(balance, tokensUser, tokens, tokensR, tokensA, tokensE, tokensTotal,
        txs, txsExits, tokensArray, tokensAArray, tokensRArray))
    } catch (error) {
      dispatch(infoAccountError(error))
    }
  }
}

async function getTokensInfo (tokensList, abiTokens, wallet, walletEth, addressRollup) {
  const tokensArray = []
  const tokensAArray = []
  const tokensUser = []
  let tokens = BigInt(0)
  let tokensA = BigInt(0)
  let walletEthAddress = wallet.publicEthKey
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
            coin: tokenId, address, amount: BigInt(tokensHex).toString()
          })
        }
        tokensA += BigInt(tokensAHex)
        if (BigInt(tokensAHex)) {
          tokensAArray.push({
            coin: tokenId, address, amount: BigInt(tokensAHex).toString()
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
          tokenId: allTxs.data[tx].coin, address: tokensList.data[allTxs.data[tx].coin]
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

function checkApprovedTokensError () {
  return {
    type: CONSTANTS.CHECK_APPROVED_TOKENS_ERROR
  }
}

export function checkApprovedTokens (tokensToSend, approvedTokens) {
  return function (dispatch) {
    if (tokensToSend > approvedTokens) {
      dispatch(checkApprovedTokensError())
    }
  }
}

function checkEtherError () {
  return {
    type: CONSTANTS.CHECK_ETHER_ERROR
  }
}

export function checkEther (etherToSend, ether) {
  return function (dispatch) {
    if (etherToSend > ether) {
      dispatch(checkEtherError())
    }
  }
}

function initApprovedTokensError () {
  return {
    type: CONSTANTS.INIT_ETHER_ERROR
  }
}

function initEtherError () {
  return {
    type: CONSTANTS.INIT_APPROVED_TOKENS_ERROR
  }
}

export function initErrors () {
  return function (dispatch) {
    dispatch(initApprovedTokensError())
    dispatch(initEtherError())
  }
}

function setGasMultiplier (num) {
  return {
    type: CONSTANTS.SET_GAS_MULTIPLIER,
    payload: num
  }
}

export function selectGasMultiplier (num) {
  return function (dispatch) {
    dispatch(setGasMultiplier(num))
  }
}

function getInfoCurrentBatch (currentBatch) {
  return {
    type: CONSTANTS.GET_CURRENT_BATCH,
    payload: currentBatch
  }
}

function getInfoCurrentBatchError () {
  return {
    type: CONSTANTS.GET_CURRENT_BATCH_ERROR
  }
}

export function getCurrentBatch (urlOperator) {
  return async function (dispatch) {
    let currentBatch
    try {
      const apiOperator = new CliExternalOperator(urlOperator)
      const resOperator = await apiOperator.getState()
      currentBatch = resOperator.data.rollupSynch.lastBatchSynched
      dispatch(getInfoCurrentBatch(currentBatch))
    } catch (err) {
      dispatch(getInfoCurrentBatchError())
    }
  }
}
