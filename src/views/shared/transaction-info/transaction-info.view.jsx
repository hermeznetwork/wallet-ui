import React from 'react'
import { TxState, TxType } from '@hermeznetwork/hermezjs/src/enums'
import { getEthereumAddress } from '@hermeznetwork/hermezjs/src/addresses'

import TransactionInfoTable from '../transaction-info-table/transaction-info-table-row.view'
import { getPartiallyHiddenEthereumAddress, getPartiallyHiddenHermezAddress } from '../../../utils/addresses'

function TransactionInfo ({ txData, accountIndex, showStatus }) {
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
              getEthereumAddress(txData.fromHezEthereumAddress)
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
    case TxType.Transfer:
    case TxType.TransferToEthAddr: {
      if (accountIndex === txData.fromAccountIndex) {
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
      } else {
        return (
          <TransactionInfoTable
            status={status}
            from={{
              subtitle: getPartiallyHiddenHermezAddress(txData.fromHezEthereumAddress)
            }}
            to={{
              subtitle: 'My Hermez address',
              value: getPartiallyHiddenHermezAddress(txData.toHezEthereumAddress)
            }}
            date={date}
          />
        )
      }
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
              getEthereumAddress(txData.fromHezEthereumAddress)
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
