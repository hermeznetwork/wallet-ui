import React from "react";
import { Link } from "react-router-dom";

import useTransactionActionsStyles from "src/views/shared/transaction-actions/transaction-actions.styles";
import { ReactComponent as SendIcon } from "src/images/icons/send.svg";
import { ReactComponent as DepositIcon } from "src/images/icons/deposit.svg";
import { ReactComponent as WithdrawIcon } from "src/images/icons/withdraw.svg";

interface TransactionActionsProps {
  hideWithdraw?: boolean;
  tokenId?: number;
  accountIndex?: string;
  hideSend?: boolean;
  hideDeposit?: boolean;
}

function TransactionActions({
  hideWithdraw,
  hideSend,
  hideDeposit,
  accountIndex,
  tokenId,
}: TransactionActionsProps): JSX.Element {
  const classes = useTransactionActionsStyles();
  const baseQueryString = accountIndex !== undefined ? `?accountIndex=${accountIndex}` : "";
  const depositQueryString =
    tokenId !== undefined && accountIndex !== undefined
      ? `?accountIndex=${accountIndex}&tokenId=${tokenId}`
      : "";

  return (
    <div className={classes.root}>
      {hideSend ? (
        <></>
      ) : (
        <div className={classes.action}>
          <Link to={`/transfer${baseQueryString}`} className={classes.button}>
            <SendIcon className={classes.buttonIcon} />
          </Link>
          <p className={classes.buttonText}>Send</p>
        </div>
      )}
      {hideDeposit ? (
        <></>
      ) : (
        <div className={classes.action}>
          <Link to={`/deposit${depositQueryString}`} className={classes.button}>
            <DepositIcon className={classes.buttonIcon} />
          </Link>
          <p className={classes.buttonText}>Deposit</p>
        </div>
      )}
      {hideWithdraw ? (
        <></>
      ) : (
        <div className={classes.action}>
          <Link to={`/withdraw${baseQueryString}`} className={classes.button}>
            <WithdrawIcon className={classes.buttonIcon} />
          </Link>
          <p className={classes.buttonText}>Withdraw</p>
        </div>
      )}
    </div>
  );
}

export default TransactionActions;
