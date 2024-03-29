import React from 'react'
import PropTypes from 'prop-types'
import { TxType } from '@hermeznetwork/hermezjs/src/enums'

import depositedIcon from '../../../../images/icons/deposited.svg'
import receivedIcon from '../../../../images/icons/received.svg'
import sentIcon from '../../../../images/icons/sent.svg'
import withdrawnIcon from '../../../../images/icons/withdrawn.svg'

function TransactionType ({ type, fromAccountIndex, accountIndex }) {
  /**
   * Returns the icon corresponding to the transaction type
   * @returns {string} - Icon content encoded in base64
   */
  function getIcon () {
    switch (type) {
      case TxType.CreateAccountDeposit:
      case TxType.Deposit: {
        return depositedIcon
      }
      case TxType.Transfer:
      case TxType.TransferToBJJ:
      case TxType.TransferToEthAddr: {
        if (fromAccountIndex === accountIndex) {
          return sentIcon
        } else {
          return receivedIcon
        }
      }
      case TxType.Withdraw:
      case TxType.Exit:
      case TxType.ForceExit: {
        return withdrawnIcon
      }
      default: {
        return undefined
      }
    }
  }

  return <img src={getIcon(type)} alt='Transaction type' />
}

TxType.propTypes = {
  type: PropTypes.string.isRequired
}

export default TransactionType
