import React from "react";
import PropTypes from "prop-types";
import { useTheme } from "react-jss";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";

import useTransactionOverviewStyles from "./transaction-overview.styles";
import {
  getTokenAmountInPreferredCurrency,
  getFixedTokenAmount,
} from "../../../../utils/currencies";
import TransactionInfo from "../../../shared/transaction-info/transaction-info.view";
import Container from "../../../shared/container/container.view";
import FiatAmount from "../../../shared/fiat-amount/fiat-amount.view";
import TokenBalance from "../../../shared/token-balance/token-balance.view";
import Spinner from "../../../shared/spinner/spinner.view";
import FormButton from "../../../shared/form-button/form-button.view";
import { getRealFee } from "../../../../utils/fees";
import Alert from "../../../shared/alert/alert.view";
import WithdrawInfoSidenav from "../withdraw-info-sidenav/withdraw-info-sidenav.view";

function TransactionOverview({
  wallet,
  isTransactionBeingSigned,
  transactionType,
  to,
  amount,
  fee,
  exit,
  instantWithdrawal,
  completeDelayedWithdrawal,
  account,
  estimatedWithdrawFeeTask,
  preferredCurrency,
  fiatExchangeRates,
  onDeposit,
  onForceExit,
  onWithdraw,
  onExit,
  onTransfer,
}) {
  const theme = useTheme();
  const classes = useTransactionOverviewStyles();
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(false);
  const [isWithdrawInfoSidenavOpen, setIsWithdrawInfoSidenavOpen] = React.useState(false);

  /**
   * Converts the transaction amount to fiat in the preferred currency
   *
   * @returns {Number} - Token amount in the user's preferred currency
   */
  function getAmountInFiat(value) {
    const token = account.token;
    const fixedAccountBalance = getFixedTokenAmount(value, token.decimals);

    return getTokenAmountInPreferredCurrency(
      fixedAccountBalance,
      token.USD,
      preferredCurrency,
      fiatExchangeRates
    );
  }

  /**
   * Converts the transaction type to a readable button label
   *
   * @returns {string} - Button label
   */
  function getButtonLabel() {
    switch (transactionType) {
      case TxType.Deposit:
        return "Deposit";
      case TxType.Transfer:
        return "Send";
      case TxType.Exit:
        return "Initiate withdraw";
      case TxType.Withdraw:
        return "Withdraw";
      case TxType.ForceExit:
        return "Force Withdrawal";
      default:
        return "";
    }
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
  async function handleFormSubmit() {
    // We only need to disable the button on L2 txs, as L1 txs are going to display an
    // spinner which will prevent the user from submitting the form twice
    switch (transactionType) {
      case TxType.Deposit: {
        return onDeposit(amount, account);
      }
      case TxType.ForceExit: {
        return onForceExit(amount, account);
      }
      case TxType.Withdraw: {
        return onWithdraw(amount, account, exit, completeDelayedWithdrawal, instantWithdrawal);
      }
      case TxType.Exit: {
        setIsButtonDisabled(true);
        return onExit(amount, account, fee);
      }
      default: {
        setIsButtonDisabled(true);
        return onTransfer(amount, account, to, fee);
      }
    }
  }

  return (
    <div className={classes.root}>
      <Container backgroundColor={theme.palette.primary.main} addHeaderPadding disableTopGutter>
        <section className={classes.section}>
          <div className={classes.highlightedAmount}>
            <TokenBalance
              amount={getFixedTokenAmount(amount, account.token.decimals)}
              symbol={account.token.symbol}
            />
          </div>
          <FiatAmount amount={getAmountInFiat(amount)} currency={preferredCurrency} />
        </section>
      </Container>
      <Container>
        <section className={classes.section}>
          {transactionType === TxType.Exit && (
            <Alert
              showHelpButton
              message="Withdrawal of funds has 2 steps. Once initiated it can’t be canceled."
              onHelpClick={handleOpenWithdrawInfoSidenav}
            />
          )}
          <TransactionInfo
            txData={{
              type: transactionType,
              fromHezEthereumAddress: wallet.hermezEthereumAddress,
              toHezEthereumAddress: to.hezEthereumAddress || to.hezBjjAddress,
              estimatedWithdrawFee: estimatedWithdrawFeeTask.data,
              fee: fee
                ? {
                    value: Number(getRealFee(amount, account.token, fee)),
                    token: account.token,
                  }
                : undefined,
            }}
            preferredCurrency={preferredCurrency}
            fiatExchangeRates={fiatExchangeRates}
          />
          {isTransactionBeingSigned ? (
            <div className={classes.signingSpinnerWrapper}>
              <Spinner />
              <p className={classes.signingText}>
                Sign in your connected wallet to confirm transaction
              </p>
            </div>
          ) : (
            <FormButton
              label={getButtonLabel()}
              onClick={handleFormSubmit}
              disabled={isButtonDisabled}
            />
          )}
        </section>
      </Container>
      {isWithdrawInfoSidenavOpen && (
        <WithdrawInfoSidenav onClose={handleCloseWithdrawInfoSidenav} />
      )}
    </div>
  );
}

TransactionOverview.propTypes = {
  wallet: PropTypes.object,
  transactionType: PropTypes.string.isRequired,
  to: PropTypes.object.isRequired,
  amount: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.object.isRequired]),
  fee: PropTypes.number,
  exit: PropTypes.object,
  instantWithdrawal: PropTypes.bool,
  completeDelayedWithdrawal: PropTypes.bool,
  account: PropTypes.object.isRequired,
  preferredCurrency: PropTypes.string.isRequired,
  fiatExchangeRates: PropTypes.object.isRequired,
};

export default TransactionOverview;
