import React from 'react'
import PropTypes from 'prop-types'
import { TxType } from '@hermeznetwork/hermezjs/src/tx-utils'

import depositedIcon from '../../../../images/icons/deposited.svg'
import receivedIcon from '../../../../images/icons/received.svg'
import sentIcon from '../../../../images/icons/sent.svg'
import withdrawnIcon from '../../../../images/icons/withdrawn.svg'

function TransactionType ({ type, amount }) {
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
      case TxType.Transfer: {
        if (Number(amount) >= 0) {
          return sentIcon
        } else {
          return receivedIcon
        }
      }
      case TxType.Withdraw:
      case TxType.Exit: {
        return withdrawnIcon
      }
      default: {
        return undefined
      }
    }
  }

  return <img src={getIcon(type)} alt='Transaction type' />
}

TransactionType.propTypes = {
  type: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired
}

export default TransactionType
