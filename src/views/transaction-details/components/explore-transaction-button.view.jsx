import React from 'react'
import hermezjs from '@hermeznetwork/hermezjs'

import useExploreTransactionButtonStyles from './explore-transaction-button.styles'
import { ReactComponent as OpenInNewTabIcon } from '../../../images/icons/open-in-new-tab.svg'
import { TxLevel } from '@hermeznetwork/hermezjs/src/tx-utils'

function ExploreTransactionButton ({ txLevel, transactionId }) {
  const classes = useExploreTransactionButtonStyles()
  const explorerName = txLevel === TxLevel.L1 ? 'Etherscan' : 'Explorer'
  const href = txLevel === TxLevel.L1
    ? `${hermezjs.Environment.getEtherscanUrl()}/tx/${transactionId}`
    : `${hermezjs.Environment.getBatchExplorerUrl()}/transaction/${transactionId}`

  return (
    <a
      className={classes.link}
      href={href}
      target='_blank'
      rel='noopener noreferrer'
    >
      <OpenInNewTabIcon className={classes.linkIcon} />
      View in {explorerName}
    </a>
  )
}

export default ExploreTransactionButton
