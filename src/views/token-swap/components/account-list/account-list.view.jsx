import React from "react";
import PropTypes from "prop-types";

import useAccountListStyles from "./account-list.styles";
import { getTokenIcon } from "../../../../utils/tokens";
import { getFixedTokenAmount } from "../../../../utils/currencies";

function AccountList({ accounts, onClick }) {
  const classes = useAccountListStyles();

  return (
    <div className={classes.listBox}>
      {accounts.map((account) => {
        const Icon = getTokenIcon(account.token.symbol);
        const balance = `${getFixedTokenAmount(account.balance, account.token.decimals)} ${
          account.token.symbol
        }`;

        return (
          <div
            key={account.token.symbol}
            className={classes.tokenBox}
            onClick={() => onClick(account)}
          >
            <div className={classes.tokenIcon}>
              <Icon />
            </div>
            <div className={classes.tokenText}>
              <p>{account.token.name}</p>
              <p className={classes.symbol}> {account.token.symbol}</p>
            </div>
            <span className={classes.balanceText}>{balance}</span>
          </div>
        );
      })}
    </div>
  );
}

AccountList.propTypes = {
  accounts: PropTypes.array,
  onClick: PropTypes.func,
};

export default AccountList;
