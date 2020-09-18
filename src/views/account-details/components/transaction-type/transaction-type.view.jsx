import React from 'react'
import PropTypes from 'prop-types'

import { TxType } from '../../../../utils/tx'
import depositedIcon from '../../../../images/icons/deposited.svg'
import receivedIcon from '../../../../images/icons/received.svg'
import sentIcon from '../../../../images/icons/sent.svg'
import withdrawnIcon from '../../../../images/icons/withdrawn.svg'

function TransactionType ({ type, amount }) {
  function getIcon () {
    switch (type) {
      case TxType.Deposit: {
        return depositedIcon
      }
      case TxType.Transfer: {
        if (amount >= 0) {
          return sentIcon
        } else {
          return receivedIcon
        }
      }
      case TxType.Withdraw: {
        return withdrawnIcon
      }
      default: {
        console.log(type)
        return undefined
      }
    }
  }

  return <img src={getIcon(type)} alt='Transaction type' />
}

TransactionType.propTypes = {
  type: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired
}

export default TransactionType
