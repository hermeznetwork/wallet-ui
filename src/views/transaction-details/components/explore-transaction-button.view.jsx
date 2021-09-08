import React from "react";
import hermezjs from "@hermeznetwork/hermezjs";

import useExploreTransactionButtonStyles from "./explore-transaction-button.styles";
import { ReactComponent as OpenInNewTabIcon } from "../../../images/icons/open-in-new-tab.svg";

function ExploreTransactionButton({ txLevel, transactionIdOrHash }) {
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
