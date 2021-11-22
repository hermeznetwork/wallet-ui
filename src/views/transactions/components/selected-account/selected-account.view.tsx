// ToDo: Remove the disable of TS and the linter below once the component are migrated to TS
/* eslint-disable */
// @ts-nocheck
import React from "react";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";

import useSelectedAccountStyles from "src/views/transactions/components/selected-account/selected-account.styles";
import { Account, EthereumAccount, FiatExchangeRates } from "src/domain/hermez";
import FiatAmount from "src/views/shared/fiat-amount/fiat-amount.view";
import { getFixedTokenAmount, getTokenAmountInPreferredCurrency } from "src/utils/currencies";
import { AsyncTask, isAsyncTaskCompleted } from "src/utils/types";

interface CommonSelectedAccountProps {
  preferredCurrency: string;
  showInFiat: boolean;
  fiatExchangeRatesTask: AsyncTask<FiatExchangeRates, string>;
}

interface SelectedAccountDepositProps {
  txType: TxType.Deposit;
  account: EthereumAccount;
  onClick: () => void;
}

interface SelectedAccountExitProps {
  txType: TxType.Exit;
  account: Account;
}

interface SelectedAccountOtherTxProps {
  txType: TxType.Transfer | TxType.ForceExit;
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
              getFixedTokenAmount(account.balance, account.decimals),
              account.token.USD,
              preferredCurrency,
              isAsyncTaskCompleted(fiatExchangeRatesTask) ? fiatExchangeRatesTask.data : {}
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
