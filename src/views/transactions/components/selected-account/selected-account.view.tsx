import React from "react";
import { Enums } from "@hermeznetwork/hermezjs";

import useSelectedAccountStyles from "src/views/transactions/components/selected-account/selected-account.styles";
import { Account, EthereumAccount, FiatExchangeRates } from "src/domain";
import FiatAmount from "src/views/shared/fiat-amount/fiat-amount.view";
import { getFixedTokenAmount, getTokenAmountInPreferredCurrency } from "src/utils/currencies";
import { AsyncTask, isAsyncTaskDataAvailable } from "src/utils/types";

const { TxType } = Enums;

interface CommonSelectedAccountProps {
  preferredCurrency: string;
  showInFiat: boolean;
  fiatExchangeRatesTask: AsyncTask<FiatExchangeRates, string>;
}

interface SelectedAccountDepositProps {
  txType: Enums.TxType.Deposit;
  account: EthereumAccount;
  onClick: () => void;
}

// Exits are only accessible from the account-details view, so you cannot go back to the
// account-selector step, and therefore it doesn't have the onClick callback
interface SelectedAccountExitProps {
  txType: Enums.TxType.Exit;
  account: Account;
}

interface SelectedAccountOtherTxProps {
  txType: Enums.TxType.Transfer | Enums.TxType.ForceExit;
  account: EthereumAccount;
  onClick: () => void;
}

type SelectedAccountProps = CommonSelectedAccountProps &
  (SelectedAccountDepositProps | SelectedAccountExitProps | SelectedAccountOtherTxProps);

function SelectedAccount(props: SelectedAccountProps): JSX.Element {
  const classes = useSelectedAccountStyles();

  const { txType, account, preferredCurrency, showInFiat, fiatExchangeRatesTask } = props;

  const RootComponent = txType === TxType.Exit ? "button" : "div";

  return (
    <RootComponent
      className={classes.root}
      {...(txType !== TxType.Exit ? { onClick: props.onClick } : {})}
    >
      <p>{account.token.name}</p>
      {showInFiat ? (
        <p>
          <FiatAmount
            currency={preferredCurrency}
            amount={getTokenAmountInPreferredCurrency(
              getFixedTokenAmount(account.balance, account.token.decimals),
              account.token,
              preferredCurrency,
              isAsyncTaskDataAvailable(fiatExchangeRatesTask) ? fiatExchangeRatesTask.data : {}
            )}
          />
        </p>
      ) : (
        <p className={classes.tokenAmount}>
          <span>{getFixedTokenAmount(account.balance, account.token.decimals)}</span>{" "}
          <span>{account.token.symbol}</span>
        </p>
      )}
    </RootComponent>
  );
}

export default SelectedAccount;
