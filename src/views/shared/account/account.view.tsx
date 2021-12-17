import React from "react";

import useAccountStyles from "src/views/shared/account/account.styles";
import { getFixedTokenAmount } from "src/utils/currencies";
import { getTxPendingTime } from "src/utils/transactions";
import FiatAmount from "src/views/shared/fiat-amount/fiat-amount.view";
import { CoordinatorState, ISOStringDate, Token } from "src/domain/hermez";

interface AccountProps {
  balance: string;
  token: Token;
  preferredCurrency: string;
  hasPendingDeposit: boolean;
  fiatBalance?: number;
  isDisabled?: boolean;
  coordinatorState?: CoordinatorState;
  timestamp?: ISOStringDate;
  onClick: () => void;
}

function Account({
  balance,
  fiatBalance,
  token,
  preferredCurrency,
  hasPendingDeposit,
  isDisabled,
  coordinatorState,
  timestamp,
  onClick,
}: AccountProps): JSX.Element {
  const classes = useAccountStyles({
    hasPendingDeposit,
    isDisabled: isDisabled || false,
  });

  const pendingTime =
    timestamp !== undefined ? getTxPendingTime(coordinatorState, true, timestamp) : 0;

  return (
    <div className={`${classes.root} ${classes.account}`} onClick={onClick}>
      <div className={`${classes.values} ${classes.topRow} ${classes.topRowText}`}>
        <p className={classes.tokenSymbol}>{token.symbol}</p>
        <p className={classes.tokenBalance}>
          {getFixedTokenAmount(balance, token.decimals)} {token.symbol}
        </p>
      </div>
      <div className={`${classes.values} ${classes.bottomRow}`}>
        {hasPendingDeposit ? (
          <div className={classes.pendingContainer}>
            <div className={classes.pendingLabelContainer}>
              <p className={classes.pendingLabelText}>Pending</p>
            </div>
            {pendingTime > 0 && <p className={classes.pendingTimer}>{pendingTime} min</p>}
          </div>
        ) : (
          <p className={classes.tokenName}>{token.name}</p>
        )}
        <p>
          <FiatAmount
            amount={fiatBalance}
            currency={preferredCurrency}
            className={classes.fiatBalance}
          />
        </p>
      </div>
    </div>
  );
}

export default Account;
