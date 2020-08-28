import ethers from 'ethers'
import abiDecoder from 'abi-decoder'

import { hexToPoint, exitAy, exitAx } from '../../utils/utils'
import { deposit, depositOnTop, withdraw, forceWithdraw, send, getGasPrice } from '../../utils/tx'
import { CliExternalOperator } from '../../utils/cli-external-operator'
import * as txActions from './tx.actions'

const gasLimit = 5000000

export function sendDeposit (addressSC, amount, tokenId, wallet, abiRollup, gasMultiplier, operatorUrl) {
  return async function (dispatch) {
    dispatch(txActions.deposit())
    if (amount === '0') {
      dispatch(txActions.depositFailure('Deposit Error: \'The amount must be greater than 0\''))
      return 'Deposit Error'
    } else {
      try {
        const babyjubToCompress = wallet.publicKeyCompressed.toString('hex')
        // eslint-disable-next-line new-cap
        const apiOperator = new CliExternalOperator(operatorUrl)
        await apiOperator.getStateAccountByAddress(tokenId, babyjubToCompress)
        const resOperator = await apiOperator.getState()
        const currentBatch = resOperator.data.rollupSynch.lastBatchSynched
        const babyjubTo = [
          wallet.publicKey[0].toString(),
          wallet.publicKey[1].toString()
        ]
        const res = await depositOnTop(addressSC, amount, tokenId,
          babyjubTo, abiRollup, gasLimit, gasMultiplier)
        dispatch(txActions.depositSuccess(res, currentBatch))
        return { res, currentBatch }
      } catch (error) {
        try {
          if (error.message.includes('404')) {
            const apiOperator = new CliExternalOperator(operatorUrl)
            const resOperator = await apiOperator.getState()
            const currentBatch = resOperator.data.rollupSynch.lastBatchSynched
            const res = await deposit(addressSC, amount, tokenId, wallet, abiRollup, gasLimit, gasMultiplier)
            dispatch(txActions.depositSuccess(res, currentBatch))
            return { res, currentBatch }
          } else {
            dispatch(txActions.depositFailure(`Deposit Error: ${error.message}`))
            return error
          }
        } catch (error2) {
          dispatch(txActions.depositFailure(`Deposit Error: ${error2.message}`))
          return error2
        }
      }
    }
  }
}

export function sendWithdraw (addressSC, tokenId, wallet, abiRollup, op, numExitRoot, gasMultiplier) {
  return async function (dispatch) {
    dispatch(txActions.withdraw())
    try {
      if (numExitRoot === -1) {
        dispatch(txActions.withdrawFailure('The num exit root must be entered'))
        return 'No numExitRoot'
      } else {
        const apiOperator = new CliExternalOperator(op)
        const resOperator = await apiOperator.getState()
        const currentBatch = resOperator.data.rollupSynch.lastBatchSynched
        const res = await withdraw(addressSC, tokenId, wallet, abiRollup,
          op, numExitRoot, gasLimit, gasMultiplier)
        abiDecoder.addABI(abiRollup)
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const txData = await provider.getTransaction(res.hash)
        const decodedData = abiDecoder.decodeMethod(txData.data)
        const amount = decodedData.params.find((param) => {
          return param.name === 'amount'
        }).value
        dispatch(txActions.withdrawSuccess(res, currentBatch))
        return { res, currentBatch, amount }
      }
    } catch (error) {
      dispatch(txActions.withdrawFailure(`Withdraw Error: ${error.message}`))
      return error
    }
  }
}

export function sendForceExit (addressSC, tokenId, amount, wallet, abiRollup, urlOperator, gasMultiplier) {
  return async function (dispatch) {
    dispatch(txActions.forceExit())
    try {
      // eslint-disable-next-line new-cap
      const apiOperator = new CliExternalOperator(urlOperator)
      const publicCompressed = wallet.publicKeyCompressed.toString('hex')
      const resAccount = await apiOperator.getStateAccountByAddress(tokenId, publicCompressed)
      let address = wallet.ethereumAddress
      if (!address.startsWith('0x')) {
        address = `0x${address}`
      }
      if (resAccount && resAccount.data.ethAddress.toUpperCase() === address.toUpperCase()) {
        const resOperator = await apiOperator.getState()
        const currentBatch = resOperator.data.rollupSynch.lastBatchSynched
        const res = await forceWithdraw(addressSC, tokenId,
          amount, wallet, abiRollup, gasLimit, gasMultiplier)
        dispatch(txActions.forceExitSuccess(res, currentBatch))
        return { res, currentBatch }
      } else {
        dispatch(txActions.forceExitFailure('This is not your ID'))
        return 'This is not your ID'
      }
    } catch (error) {
      dispatch(txActions.forceExitFailure(`Force Exit Error: ${error.message}`))
      return error
    }
  }
}

export function sendTransfer (urlOperator, babyjubTo, amount, wallet, tokenId, fee) {
  return async function (dispatch) {
    dispatch(txActions.transfer())
    try {
      if (fee === 0) {
        dispatch(txActions.transferFailure(
          'If a fee greater than 1 token is not entered,the operator will not forge the transaction'
        ))
        return 'If a fee greater than 1 token is not entered, the operator will not forge the transaction'
      } else {
        const item = localStorage.getItem('nonceObject')
        let nonceObject
        if (item === null) {
          nonceObject = undefined
        } else {
          nonceObject = JSON.parse(item)
        }

        const apiOperator = new CliExternalOperator(urlOperator)
        const babyjub = wallet.publicKeyCompressed.toString('hex')
        const resAccount = await apiOperator.getStateAccountByAddress(tokenId, babyjub)
        let address = wallet.ethereumAddress
        if (!address.startsWith('0x')) {
          address = `0x${address}`
        }
        if (resAccount && resAccount.data.ethAddress.toUpperCase() === address.toUpperCase()) {
          const resOperator = await apiOperator.getState()
          const currentBatch = resOperator.data.rollupSynch.lastBatchSynched
          let babyjubToAxAy
          if (babyjubTo === 'exit') {
            babyjubToAxAy = [exitAx, exitAy]
          } else {
            babyjubToAxAy = hexToPoint(babyjubTo)
          }

          const res = await send(urlOperator, babyjubToAxAy, amount, wallet, tokenId,
            fee, undefined, nonceObject, address)
          localStorage.setItem('nonceObject', JSON.stringify(res.nonceObject))
          dispatch(txActions.transferSuccess(res.nonce, currentBatch))
          return res
        } else {
          dispatch(txActions.transferFailure('You do not have this token in rollup'))
          return 'You do not have this token in rollup'
        }
      }
    } catch (error) {
      dispatch(txActions.transferFailure(`Send Error: ${error.message}`))
      return error
    }
  }
}

export function sendApprove (addressTokens, abiTokens, amountToken, addressRollup, gasMultiplier) {
  return async function (dispatch) {
    dispatch(txActions.approve())
    try {
      if (amountToken === '0') {
        dispatch(txActions.approveFailure('The amount of tokens must be greater than 0'))
        return 'Approve Error'
      } else {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contractTokens = new ethers.Contract(addressTokens, abiTokens, signer)
        const gasPrice = await getGasPrice(gasMultiplier, provider)
        const overrides = {
          gasLimit,
          gasPrice: gasPrice._hex
        }
        const res = await contractTokens.approve(addressRollup, amountToken, overrides)
        dispatch(txActions.approveSuccess(res))
        return res
      }
    } catch (error) {
      dispatch(txActions.approveFailure(`Approve Error: ${error.message}`))
      return error.message
    }
  }
}

export function sendFetchTokens (addressTokens) {
  return async function (dispatch) {
    dispatch(txActions.fetchTokens())
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const tx = {
        to: addressTokens,
        value: ethers.utils.parseEther('0')
      }
      const res = await signer.sendTransaction(tx)
      dispatch(txActions.fetchTokensSuccess(res))
      return res
    } catch (error) {
      dispatch(txActions.fetchTokensFailure(`Get Tokens Error: ${error.message}`))
      return error
    }
  }
}
