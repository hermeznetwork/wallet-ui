// ToDo: Remove the disable of TS and the linter below once the component are migrated to TS
/* eslint-disable */
// @ts-nocheck
import React from "react";
import { useTheme } from "react-jss";
import { BigNumber } from "ethers";

import useTransactionOverviewStyles from "src/views/transactions/components/transaction-overview/transaction-overview.styles";
import { getTokenAmountInPreferredCurrency, getFixedTokenAmount } from "src/utils/currencies";
import TransactionInfo from "src/views/shared/transaction-info/transaction-info.view";
import Container from "src/views/shared/container/container.view";
import FiatAmount from "src/views/shared/fiat-amount/fiat-amount.view";
import TokenBalance from "src/views/shared/token-balance/token-balance.view";
import Spinner from "src/views/shared/spinner/spinner.view";
import PrimaryButton from "src/views/shared/primary-button/primary-button.view";
import { getRealFee } from "src/utils/fees";
import Alert from "src/views/shared/alert/alert.view";
import WithdrawInfoSidenav from "src/views/transactions/components/withdraw-info-sidenav/withdraw-info-sidenav.view";
import { AsyncTask } from "src/utils/types";
import { Theme } from "src/styles/theme";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";

// domain
import { HermezWallet, Account, FiatExchangeRates, Exit } from "src/domain/hermez";
import { EstimatedWithdrawFee } from "src/domain";

type Transaction =
  | {
      type: TxType.Deposit;
      amount: BigNumber;
      account: Account;
      onDeposit: (amount: BigNumber, account: Account) => void;
    }
  | {
      type: TxType.Transfer;
      amount: BigNumber;
      account: Account;
      to: Partial<Account>;
      fee: number;
      onTransfer: (amount: BigNumber, account: Account, to: Partial<Account>, fee: number) => void;
    }
  | {
      type: TxType.Exit;
      amount: BigNumber;
      account: Account;
      fee: number;
      estimatedWithdrawFeeTask: AsyncTask<EstimatedWithdrawFee, Error>;
      onExit: (amount: BigNumber, account: Account, fee: number) => void;
    }
  | {
      type: TxType.Withdraw;
      amount: BigNumber;
      account: Account;
      exit: Exit;
      completeDelayedWithdrawal: boolean;
      instantWithdrawal: boolean;
      estimatedWithdrawFeeTask: AsyncTask<EstimatedWithdrawFee, Error>;
      onWithdraw: (
        amount: BigNumber,
        account: Account,
        exit: Exit,
        completeDelayedWithdrawal: boolean,
        instantWithdrawal: boolean
      ) => void;
    }
  | {
      type: TxType.ForceExit;
      amount: BigNumber;
      account: Account;
      onForceExit: (amount: BigNumber, account: Account) => void;
    };

interface TransactionOverviewProps {
  wallet: HermezWallet.HermezWallet;
  isTransactionBeingApproved: boolean;
  preferredCurrency: string;
  fiatExchangeRates: FiatExchangeRates;
  transaction: Transaction;
}

function TransactionOverview({
  wallet,
  isTransactionBeingApproved,
  preferredCurrency,
  fiatExchangeRates,
  transaction,
}: TransactionOverviewProps): JSX.Element {
  const theme = useTheme<Theme>();
  const classes = useTransactionOverviewStyles();
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(false);
  const [isWithdrawInfoSidenavOpen, setIsWithdrawInfoSidenavOpen] = React.useState(false);
  const { account, amount, type } = transaction;

  React.useEffect(() => {
    if (!isTransactionBeingApproved) {
      setIsButtonDisabled(false);
    }
  }, [isTransactionBeingApproved]);

  /**
   * Converts the transaction amount to fiat in the preferred currency
   *
   * @returns {Number} - Token amount in the user's preferred currency
   */
  function getAmountInFiat(value: string) {
    const token = account.token;
    const fixedAccountBalance = getFixedTokenAmount(value, token.decimals);

    return getTokenAmountInPreferredCurrency(
      fixedAccountBalance,
      token.USD,
      preferredCurrency,
      fiatExchangeRates
    );
  }

  function handleOpenWithdrawInfoSidenav() {
    setIsWithdrawInfoSidenavOpen(true);
  }

  function handleCloseWithdrawInfoSidenav() {
    setIsWithdrawInfoSidenavOpen(false);
  }

  /**
   * Bubbles up an event to send the transaction accordingly
   * @returns {void}
   */
  function handleFormSubmit(): void {
    // We only need to disable the button on L2 txs, as L1 txs are going to display an
    // spinner which will prevent the user from submitting the form twice
    switch (type) {
      case TxType.Deposit: {
        return transaction.onDeposit(amount, account);
      }
      case TxType.ForceExit: {
        return transaction.onForceExit(amount, account);
      }
      case TxType.Withdraw: {
        return transaction.onWithdraw(
          amount,
          account,
          transaction.exit,
          transaction.completeDelayedWithdrawal,
          transaction.instantWithdrawal
        );
      }
      case TxType.Exit: {
        setIsButtonDisabled(true);
        return transaction.onExit(amount, account, transaction.fee);
      }
      default: {
        setIsButtonDisabled(true);
        return transaction.onTransfer(amount, account, transaction.to, transaction.fee);
      }
    }
  }

  const header: JSX.Element = (
    <Container backgroundColor={theme.palette.primary.main} addHeaderPadding disableTopGutter>
      <section className={classes.section}>
        <div className={classes.highlightedAmount}>
          <TokenBalance
            amount={getFixedTokenAmount(amount.toString(), account.token.decimals)}
            symbol={account.token.symbol}
          />
        </div>
        <FiatAmount amount={getAmountInFiat(amount.toString())} currency={preferredCurrency} />
      </section>
    </Container>
  );

  const footer = (buttonLabel: string): JSX.Element =>
    isTransactionBeingApproved ? (
      <div className={classes.signingSpinnerWrapper}>
        <Spinner />
        <p className={classes.signingText}>Sign in your connected wallet to confirm transaction</p>
      </div>
    ) : (
      <PrimaryButton label={buttonLabel} onClick={handleFormSubmit} disabled={isButtonDisabled} />
    );

  switch (type) {
    case TxType.Deposit: {
      return (
        <div className={classes.root}>
          {header}
          <Container>
            <section className={classes.section}>
              <TransactionInfo
                txData={{
                  type: TxType.Deposit,
                  fromHezEthereumAddress: wallet.hermezEthereumAddress,
                  // ToDo: To be removed
                  toHezEthereumAddress: undefined,
                  // ToDo: To be removed
                  estimatedWithdrawFee: { status: "pending" },
                  // ToDo: To be removed
                  fee: undefined,
                }}
                preferredCurrency={preferredCurrency}
                fiatExchangeRates={fiatExchangeRates}
              />
              {footer("Deposit")}
            </section>
          </Container>
        </div>
      );
    }
    case TxType.ForceExit: {
      return (
        <div className={classes.root}>
          {header}
          <Container>
            <section className={classes.section}>
              <TransactionInfo
                txData={{
                  type: TxType.ForceExit,
                  fromHezEthereumAddress: wallet.hermezEthereumAddress,
                  // ToDo: To be removed
                  toHezEthereumAddress: undefined,
                  // ToDo: To be removed
                  estimatedWithdrawFee: { status: "pending" },
                  // ToDo: To be removed
                  fee: undefined,
                }}
                preferredCurrency={preferredCurrency}
                fiatExchangeRates={fiatExchangeRates}
              />
              {footer("Force Withdrawal")}
            </section>
          </Container>
        </div>
      );
    }
    case TxType.Withdraw: {
      return (
        <div className={classes.root}>
          {header}
          <Container>
            <section className={classes.section}>
              <TransactionInfo
                txData={{
                  type: TxType.Withdraw,
                  fromHezEthereumAddress: wallet.hermezEthereumAddress,
                  // ToDo: To be removed
                  toHezEthereumAddress: undefined,
                  estimatedWithdrawFee:
                    transaction.estimatedWithdrawFeeTask.status === "successful" ||
                    transaction.estimatedWithdrawFeeTask.status === "reloading"
                      ? transaction.estimatedWithdrawFeeTask.data
                      : null,
                  // ToDo: To be removed
                  fee: undefined,
                }}
                preferredCurrency={preferredCurrency}
                fiatExchangeRates={fiatExchangeRates}
              />
              {footer("Withdraw")}
            </section>
          </Container>
        </div>
      );
    }
    case TxType.Exit: {
      return (
        <div className={classes.root}>
          {header}
          <Container>
            <section className={classes.section}>
              <Alert
                showHelpButton
                message="Withdrawal of funds has 2 steps. Once initiated it can’t be canceled."
                onHelpClick={handleOpenWithdrawInfoSidenav}
              />
              <TransactionInfo
                txData={{
                  type: TxType.Exit,
                  fromHezEthereumAddress: wallet.hermezEthereumAddress,
                  estimatedWithdrawFee:
                    transaction.estimatedWithdrawFeeTask.status === "successful" ||
                    transaction.estimatedWithdrawFeeTask.status === "reloading"
                      ? transaction.estimatedWithdrawFeeTask.data
                      : null,
                  fee: {
                    value: Number(getRealFee(amount.toString(), account.token, transaction.fee)),
                    token: account.token,
                  },
                }}
                preferredCurrency={preferredCurrency}
                fiatExchangeRates={fiatExchangeRates}
              />
              {footer("Initiate withdraw")}
            </section>
          </Container>
          {isWithdrawInfoSidenavOpen && (
            <WithdrawInfoSidenav onClose={handleCloseWithdrawInfoSidenav} />
          )}
        </div>
      );
    }
    case TxType.Transfer: {
      return (
        <div className={classes.root}>
          {header}
          <Container>
            <section className={classes.section}>
              <TransactionInfo
                txData={{
                  type: TxType.Transfer,
                  fromHezEthereumAddress: wallet.hermezEthereumAddress,
                  toHezEthereumAddress: transaction.to.hezEthereumAddress || transaction.to.bjj,
                  // ToDo: To be removed
                  estimatedWithdrawFee: { status: "pending" },
                  fee: {
                    value: Number(getRealFee(amount.toString(), account.token, transaction.fee)),
                    token: account.token,
                  },
                }}
                preferredCurrency={preferredCurrency}
                fiatExchangeRates={fiatExchangeRates}
              />
              {footer("Send")}
            </section>
          </Container>
        </div>
      );
    }
    default: {
      return <></>;
    }
  }
}

export default TransactionOverview;
