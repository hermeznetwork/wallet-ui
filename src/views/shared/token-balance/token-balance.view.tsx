import React from "react";

import useTokenBalanceStyles from "src/views/shared/token-balance/token-balance.styles";

interface TokenBalanceProps {
  amount?: string;
  symbol?: string;
}

function TokenBalance({ amount, symbol }: TokenBalanceProps): JSX.Element {
  const classes = useTokenBalanceStyles();

  return (
    <p className={classes.root}>
      <span className={classes.amount}>
        {amount && !isNaN(Number(amount)) ? amount : "--"} {symbol || <></>}
      </span>
    </p>
  );
}

export default TokenBalance;
