import React from 'react'
import { TxState, TxType } from '@hermeznetwork/hermezjs/src/tx-utils'

import TransactionInfoTable from '../transaction-info-table/transaction-info-table-row.view'
import { getEthereumAddressFromHermezAddress, getPartiallyHiddenEthereumAddress, getPartiallyHiddenHermezAddress } from '../../../utils/addresses'

function TransactionInfo ({ txData, showStatus }) {
  const status = showStatus && {
    subtitle: !txData.state || txData.state === TxState.Forged ? 'Confirmed' : 'Pending'
  }
  const date = txData.timestamp && {
    subtitle: new Date(txData.timestamp).toLocaleString()
  }

  switch (txData.type) {
    case TxType.CreateAccountDeposit:
    case TxType.Deposit: {
      return (
        <TransactionInfoTable
          status={status}
          from={{
            subtitle: 'My Ethereum address',
            value: getPartiallyHiddenEthereumAddress(
              getEthereumAddressFromHermezAddress(txData.fromHezEthereumAddress)
            )
          }}
          to={{
            subtitle: 'My Hermez address',
            value: getPartiallyHiddenHermezAddress(txData.fromHezEthereumAddress)
          }}
          date={date}
        />
      )
    }
    case TxType.Transfer: {
      return (
        <TransactionInfoTable
          status={status}
          from={{
            subtitle: 'My Hermez address',
            value: getPartiallyHiddenHermezAddress(txData.fromHezEthereumAddress)
          }}
          to={{
            subtitle: getPartiallyHiddenHermezAddress(txData.toHezEthereumAddress)
          }}
          date={date}
        />
      )
    }
    case TxType.Withdraw:
    case TxType.Exit:
    case TxType.ForceExit: {
      return (
        <TransactionInfoTable
          status={status}
          from={{
            subtitle: 'My Hermez address',
            value: getPartiallyHiddenHermezAddress(txData.fromHezEthereumAddress)
          }}
          to={{
            subtitle: 'My Ethereum address',
            value: getPartiallyHiddenEthereumAddress(
              getEthereumAddressFromHermezAddress(txData.fromHezEthereumAddress)
            )
          }}
          date={date}
        />
      )
    }
    default: {
      return <></>
    }
  }
}

export default TransactionInfo
