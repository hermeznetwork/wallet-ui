import React from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { useTheme } from "react-jss";
import { push } from "connected-react-router";
import { TxType, TxLevel, TxState } from "@hermeznetwork/hermezjs/src/enums";
import { BigNumber } from "@ethersproject/bignumber";
import { parseUnits } from "ethers/lib/utils";

import { AppState, AppDispatch } from "src/store";
import * as transactionDetailsThunks from "src/store/transaction-details/transaction-details.thunks";
import { changeHeader, openSnackbar } from "src/store/global/global.actions";
import {
  getFixedTokenAmount,
  getAmountInPreferredCurrency,
  getTokenAmountInPreferredCurrency,
  getFeeInUsd,
} from "src/utils/currencies";
import { getTransactionAmount, getTxPendingTime, formatMinutes } from "src/utils/transactions";
import { AsyncTask, isAsyncTaskDataAvailable } from "src/utils/types";
import { ReactComponent as InfoIcon } from "src/images/icons/info.svg";
import useTransactionDetailsStyles from "src/views/transaction-details/transaction-details.styles";
import Spinner from "src/views/shared/spinner/spinner.view";
import Container from "src/views/shared/container/container.view";
import FiatAmount from "src/views/shared/fiat-amount/fiat-amount.view";
import TokenBalance from "src/views/shared/token-balance/token-balance.view";
import TransactionInfo from "src/views/shared/transaction-info/transaction-info.view";
import ExploreTransactionButton from "src/views/transaction-details/components/explore-transaction-button.view";
// domain
import {
  CoordinatorState,
  FiatExchangeRates,
  HistoryTransaction,
  isHistoryTransaction,
  isPendingDeposit,
  isPoolTransaction,
  Message,
  PendingDeposit,
  PoolTransaction,
} from "src/domain";
import { Theme } from "src/styles/theme";

interface TransactionDetailsStateProps {
  transactionTask: AsyncTask<PendingDeposit | HistoryTransaction | PoolTransaction, string>;
  fiatExchangeRatesTask: AsyncTask<FiatExchangeRates, string>;
  preferredCurrency: string;
  coordinatorStateTask: AsyncTask<CoordinatorState, string>;
}

interface TransactionDetailsHandlerProps {
  onLoadTransaction: (transactionId: string) => void;
  onChangeHeader: (type: TxType, accountIndex: string) => void;
  onOpenSnackbar: (message: Message) => void;
}

type TransactionDetailsProps = TransactionDetailsStateProps & TransactionDetailsHandlerProps;

interface UrlParams {
  accountIndex?: string;
  transactionId?: string;
}

function TransactionDetails({
  transactionTask,
  fiatExchangeRatesTask,
  preferredCurrency,
  coordinatorStateTask,
  onLoadTransaction,
  onChangeHeader,
  onOpenSnackbar,
}: TransactionDetailsProps): JSX.Element {
  const theme = useTheme<Theme>();
  const classes = useTransactionDetailsStyles();

  const { accountIndex, transactionId } = useParams<UrlParams>();

  React.useEffect(() => {
    if (transactionId) {
      onLoadTransaction(transactionId);
    }
  }, [transactionId, onLoadTransaction]);

  React.useEffect(() => {
    if (accountIndex && isAsyncTaskDataAvailable(transactionTask)) {
      onChangeHeader(transactionTask.data.type, accountIndex);
    }
  }, [transactionTask, accountIndex, onChangeHeader]);

  /**
   * Converts the transaction amount in USD to an amount in the user's preferred currency
   */
  function getTransactionFiatAmount(
    transactionTask: TransactionDetailsProps["transactionTask"]
  ): number | undefined {
    if (!isAsyncTaskDataAvailable(fiatExchangeRatesTask)) {
      return undefined;
    } else if (isAsyncTaskDataAvailable(transactionTask)) {
      const { token } = transactionTask.data;

      const historicUSD = isHistoryTransaction(transactionTask.data)
        ? transactionTask.data.historicUSD
        : null;

      const amount = getTransactionAmount(transactionTask.data);

      if (historicUSD) {
        return getAmountInPreferredCurrency(
          historicUSD,
          preferredCurrency,
          fiatExchangeRatesTask.data
        );
      } else if (amount) {
        const fixedAccountBalance = getFixedTokenAmount(amount, token.decimals);

        return getTokenAmountInPreferredCurrency(
          fixedAccountBalance,
          token,
          preferredCurrency,
          fiatExchangeRatesTask.data
        );
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }

  function getHistoryTransactionFee(historyTransaction: HistoryTransaction): BigNumber | undefined {
    const { L2Info, token, amount } = historyTransaction;
    if (!L2Info || !token.USD) {
      return undefined;
    } else if (L2Info.historicFeeUSD) {
      const feeUsd = L2Info.historicFeeUSD;
      const feeToken = feeUsd / token.USD;
      return parseUnits(feeToken.toFixed(token.decimals), token.decimals);
    } else {
      const feeUsd = getFeeInUsd(L2Info.fee, amount, token);
      const feeToken = feeUsd / token.USD;
      return parseUnits(feeToken.toFixed(token.decimals), token.decimals);
    }
  }

  function getPoolTransactionFee(poolTransaction: PoolTransaction): BigNumber | undefined {
    const { fee, token, amount } = poolTransaction;
    if (!token.USD) {
      return undefined;
    }
    const feeUsd = getFeeInUsd(fee, amount, token);
    const feeToken = feeUsd / token.USD;
    return parseUnits(feeToken.toFixed(token.decimals), token.decimals);
  }

  /**
   * Converts the transaction fee to the supported value
   */
  function getTransactionFee(
    transactionTask: TransactionDetailsProps["transactionTask"]
  ): BigNumber | undefined {
    if (!isAsyncTaskDataAvailable(transactionTask)) {
      return undefined;
    } else if (isHistoryTransaction(transactionTask.data)) {
      return getHistoryTransactionFee(transactionTask.data);
    } else if (isPoolTransaction(transactionTask.data)) {
      return getPoolTransactionFee(transactionTask.data);
    } else {
      // transactionTask.data is a PendingDeposit
      return undefined;
    }
  }

  const transactionAmount = isAsyncTaskDataAvailable(transactionTask)
    ? getTransactionAmount(transactionTask.data)
    : undefined;

  return (
    <div className={classes.root}>
      <Container backgroundColor={theme.palette.primary.main} disableTopGutter addHeaderPadding>
        <section className={classes.section}>
          <div className={classes.highlightedAmount}>
            {isAsyncTaskDataAvailable(transactionTask) && transactionAmount ? (
              <TokenBalance
                amount={getFixedTokenAmount(transactionAmount, transactionTask.data.token.decimals)}
                symbol={transactionTask.data.token.symbol}
              />
            ) : null}
          </div>
          <FiatAmount
            amount={getTransactionFiatAmount(transactionTask)}
            currency={preferredCurrency}
          />
        </section>
      </Container>
      <Container>
        <section className={classes.section}>
          {(() => {
            switch (transactionTask.status) {
              case "loading":
              case "failed": {
                return <Spinner />;
              }
              case "successful": {
                const type = transactionTask.data.type;
                const isL1 =
                  type === TxType.Deposit ||
                  type === TxType.CreateAccountDeposit ||
                  type === TxType.ForceExit;
                const pendingTime = isAsyncTaskDataAvailable(coordinatorStateTask)
                  ? getTxPendingTime(
                      isL1,
                      transactionTask.data.timestamp,
                      coordinatorStateTask.data
                    )
                  : undefined;
                const poolTransactionForgingPendingTime =
                  isPoolTransaction(transactionTask.data) &&
                  !transactionTask.data.batchNum &&
                  transactionTask.data.state !== TxState.Forged &&
                  pendingTime &&
                  pendingTime > 0
                    ? formatMinutes(pendingTime)
                    : undefined;
                return (
                  <>
                    {poolTransactionForgingPendingTime && (
                      <p className={classes.timeEstimate}>
                        <InfoIcon className={classes.timeEstimateIcon} />
                        <span>
                          The next block will be produced to Layer 2 in an estimated time of{" "}
                          {poolTransactionForgingPendingTime}.
                        </span>
                      </p>
                    )}
                    <TransactionInfo
                      transaction={transactionTask.data}
                      fee={getTransactionFee(transactionTask)}
                      accountIndex={accountIndex}
                      preferredCurrency={preferredCurrency}
                      fiatExchangeRates={
                        isAsyncTaskDataAvailable(fiatExchangeRatesTask)
                          ? fiatExchangeRatesTask.data
                          : undefined
                      }
                      showStatus
                      onToCopyClick={() => onOpenSnackbar({ type: "info", text: "Copied" })}
                      onFromCopyClick={() => onOpenSnackbar({ type: "info", text: "Copied" })}
                    />
                    <ExploreTransactionButton
                      txLevel={isPendingDeposit(transactionTask.data) ? TxLevel.L1 : TxLevel.L2}
                      transactionIdOrHash={
                        isPendingDeposit(transactionTask.data)
                          ? transactionTask.data.hash
                          : transactionTask.data.id
                      }
                    />
                  </>
                );
              }
              default: {
                return <></>;
              }
            }
          })()}
        </section>
      </Container>
    </div>
  );
}

const mapStateToProps = (state: AppState): TransactionDetailsStateProps => ({
  preferredCurrency: state.myAccount.preferredCurrency,
  transactionTask: state.transactionDetails.transactionTask,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask,
  coordinatorStateTask: state.global.coordinatorStateTask,
});

function getHeaderTitle(transactionType: TxType) {
  switch (transactionType) {
    case TxType.CreateAccountDeposit:
    case TxType.Deposit: {
      return "Deposited";
    }
    case TxType.Withdraw:
    case TxType.Exit:
    case TxType.ForceExit: {
      return "Withdrawn";
    }
    case TxType.TransferToEthAddr:
    case TxType.TransferToBJJ:
    case TxType.Transfer: {
      return "Transfer";
    }
  }
}

const mapDispatchToProps = (dispatch: AppDispatch): TransactionDetailsHandlerProps => ({
  onLoadTransaction: (transactionIdOrHash: string) =>
    dispatch(transactionDetailsThunks.fetchTransaction(transactionIdOrHash)),
  onOpenSnackbar: (message) => dispatch(openSnackbar({ message })),
  onChangeHeader: (transactionType, accountIndex) =>
    dispatch(
      changeHeader({
        type: "page",
        data: {
          title: getHeaderTitle(transactionType),
          closeAction: push(`/accounts/${accountIndex}`),
        },
      })
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(TransactionDetails);
