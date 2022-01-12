import React from "react";
import hermezjs from "@hermeznetwork/hermezjs";

import useExploreTransactionButtonStyles from "src/views/transaction-details/components/explore-transaction-button.styles";
import { ReactComponent as OpenInNewTabIcon } from "src/images/icons/open-in-new-tab.svg";

interface ExploreTransactionButtonProps {
  txLevel: hermezjs.Enums.TxLevel;
  transactionIdOrHash: string;
}

function ExploreTransactionButton({
  txLevel,
  transactionIdOrHash,
}: ExploreTransactionButtonProps): JSX.Element {
  const classes = useExploreTransactionButtonStyles();
  const explorerName = txLevel === hermezjs.Enums.TxLevel.L1 ? "Etherscan" : "Explorer";
  const href =
    txLevel === hermezjs.Enums.TxLevel.L1
      ? `${hermezjs.Environment.getEtherscanUrl()}/tx/${transactionIdOrHash}`
      : `${hermezjs.Environment.getBatchExplorerUrl()}/transaction/${transactionIdOrHash}`;

  return (
    <a className={classes.link} href={href} target="_blank" rel="noopener noreferrer">
      <OpenInNewTabIcon className={classes.linkIcon} />
      View in {explorerName}
    </a>
  );
}

export default ExploreTransactionButton;
