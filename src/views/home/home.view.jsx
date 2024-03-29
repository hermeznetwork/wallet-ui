import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useTheme } from 'react-jss'
import { push } from 'connected-react-router'

import useHomeStyles from './home.styles'
import * as globalThunks from '../../store/global/global.thunks'
import * as homeThunks from '../../store/home/home.thunks'
import FiatAmount from '../shared/fiat-amount/fiat-amount.view'
import AccountList from '../shared/account-list/account-list.view'
import Spinner from '../shared/spinner/spinner.view'
import Container from '../shared/container/container.view'
import { copyToClipboard } from '../../utils/browser'
import { changeHeader, openSnackbar } from '../../store/global/global.actions'
import TransactionActions from '../shared/transaction-actions/transaction-actions.view'
import ExitList from '../shared/exit-list/exit-list.view'
import { getPartiallyHiddenHermezAddress } from '../../utils/addresses'
import Button from '../shared/button/button.view'
import InfiniteScroll from '../shared/infinite-scroll/infinite-scroll.view'
import { resetState } from '../../store/home/home.actions'
import { WithdrawRedirectionRoute } from '../transaction/transaction.view'
import { TxType } from '@hermeznetwork/hermezjs/src/enums'
import PendingDepositList from './components/pending-deposit-list/pending-deposit-list.view'
import * as storage from '../../utils/storage'
import { mergeExits } from '../../utils/transactions'
import ReportIssueButton from './components/report-issue-button/report-issue-button.view'
import { AUTO_REFRESH_RATE } from '../../constants'
import * as globalActions from '../../store/global/global.actions'

function Home ({
  wallet,
  ethereumNetworkTask,
  pendingDepositsCheckTask,
  totalBalanceTask,
  accountsTask,
  poolTransactionsTask,
  exitsTask,
  fiatExchangeRatesTask,
  preferredCurrency,
  pendingDeposits,
  pendingWithdraws,
  pendingDelayedWithdraws,
  coordinatorStateTask,
  rewards,
  onChangeHeader,
  onCheckPendingDeposits,
  onLoadTotalBalance,
  onLoadAccounts,
  onLoadPoolTransactions,
  onLoadExits,
  onLoadEstimatedReward,
  onLoadEarnedReward,
  onAddPendingDelayedWithdraw,
  onRemovePendingDelayedWithdraw,
  onCheckPendingDelayedWithdrawals,
  onCheckPendingWithdrawals,
  onNavigateToAccountDetails,
  onOpenSnackbar,
  onCleanup
}) {
  const theme = useTheme()
  const classes = useHomeStyles()
  const accountPendingDeposits = storage.getItemsByHermezAddress(
    pendingDeposits,
    ethereumNetworkTask.data.chainId,
    wallet.hermezEthereumAddress
  )
  const accountPendingWithdraws = storage.getItemsByHermezAddress(
    pendingWithdraws,
    ethereumNetworkTask.data.chainId,
    wallet.hermezEthereumAddress
  )
  const accountPendingDelayedWithdraws = storage.getItemsByHermezAddress(
    pendingDelayedWithdraws,
    ethereumNetworkTask.data.chainId,
    wallet.hermezEthereumAddress
  )
  const pendingOnTopDeposits = accountPendingDeposits
    .filter(deposit => deposit.type === TxType.Deposit)
  const pendingCreateAccountDeposits = accountPendingDeposits
    .filter(deposit => deposit.type === TxType.CreateAccountDeposit)

  React.useEffect(() => {
    onChangeHeader(theme.palette.primary.main)
  }, [theme, onChangeHeader])

  React.useEffect(() => {
    onCheckPendingDeposits()
    onLoadPoolTransactions()
    onLoadExits()
    onCheckPendingWithdrawals()
    onCheckPendingDelayedWithdrawals()
  }, [])

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      onCheckPendingDeposits()
      onLoadPoolTransactions()
      onLoadExits()
      onCheckPendingWithdrawals()
      onCheckPendingDelayedWithdrawals()
    }, AUTO_REFRESH_RATE)

    return () => { clearInterval(intervalId) }
  }, [])

  React.useEffect(() => {
    if (
      pendingDepositsCheckTask.status === 'successful' &&
      poolTransactionsTask.status === 'successful' &&
      fiatExchangeRatesTask.status === 'successful'
    ) {
      onLoadTotalBalance(
        wallet.publicKeyBase64,
        poolTransactionsTask.data,
        accountPendingDeposits,
        fiatExchangeRatesTask.data,
        preferredCurrency
      )
      onLoadAccounts(
        wallet.publicKeyBase64,
        undefined,
        poolTransactionsTask.data,
        accountPendingDeposits,
        fiatExchangeRatesTask.data,
        preferredCurrency
      )
    }
  }, [pendingDepositsCheckTask, poolTransactionsTask, fiatExchangeRatesTask, wallet, onLoadTotalBalance, onLoadAccounts])

  React.useEffect(() => onCleanup, [onCleanup])

  /**
   * Filters the transactions of type exit from the transaction pool
   * @returns {void}
   */
  function getPendingExits () {
    return poolTransactionsTask.data.filter((transaction) => transaction.type === TxType.Exit)
  }

  /**
   * Navigates to the AccountDetails view when an account is clicked
   * @param {Object} account - Account
   * @returns {void}
   */
  function handleAccountClick (account) {
    onNavigateToAccountDetails(account.accountIndex)
  }

  /**
   * Copies the Hermez Ethereum address to the clipboard when it's clicked
   * @param {string} hermezEthereumAddress - Hermez Ethereum address
   * @returns {void}
   */
  function handleEthereumAddressClick (hermezEthereumAddress) {
    copyToClipboard(hermezEthereumAddress)
    onOpenSnackbar('The Hermez address has been copied to the clipboard!')
  }

  return wallet && (
    <div className={classes.root}>
      <Container backgroundColor={theme.palette.primary.main} addHeaderPadding disableTopGutter>
        <section className={classes.section}>
          {ethereumNetworkTask.data.chainId === 4 && (
            <p className={classes.networkLabel}>{ethereumNetworkTask.data.name}</p>
          )}
          <Button
            text={getPartiallyHiddenHermezAddress(wallet.hermezEthereumAddress)}
            className={classes.walletAddress}
            onClick={() => handleEthereumAddressClick(wallet.hermezEthereumAddress)}
          />
          <div className={classes.accountBalance}>
            <FiatAmount
              amount={totalBalanceTask.data}
              currency={preferredCurrency}
            />
          </div>
          <TransactionActions
            hideSend={
              accountsTask.status === 'successful' || accountsTask.status === 'reloading'
                ? accountsTask.data.accounts.length === 0
                : true
            }
            hideWithdraw
          />
        </section>
      </Container>
      <Container fullHeight>
        <section className={`${classes.section} ${classes.sectionLast}`}>
          {
            poolTransactionsTask.status === 'successful' || poolTransactionsTask.status === 'reloading'
              ? <ExitList
                  transactions={getPendingExits()}
                  fiatExchangeRates={fiatExchangeRatesTask.data}
                  preferredCurrency={preferredCurrency}
                  babyJubJub={wallet.publicKeyCompressedHex}
                  pendingWithdraws={accountPendingWithdraws}
                  pendingDelayedWithdraws={accountPendingDelayedWithdraws}
                  onAddPendingDelayedWithdraw={onAddPendingDelayedWithdraw}
                  onRemovePendingDelayedWithdraw={onRemovePendingDelayedWithdraw}
                  coordinatorState={coordinatorStateTask?.data}
                  redirectTo={WithdrawRedirectionRoute.Home}
                />
              : <></>
          }
          {
            (exitsTask.status === 'successful' ||
              exitsTask.status === 'reloading') &&
                <ExitList
                  transactions={mergeExits(exitsTask.data.exits, accountPendingDelayedWithdraws)}
                  fiatExchangeRates={
                  fiatExchangeRatesTask.status === 'successful'
                    ? fiatExchangeRatesTask.data
                    : undefined
                }
                  preferredCurrency={preferredCurrency}
                  babyJubJub={wallet.publicKeyCompressedHex}
                  pendingWithdraws={accountPendingWithdraws}
                  pendingDelayedWithdraws={accountPendingDelayedWithdraws}
                  onAddPendingDelayedWithdraw={onAddPendingDelayedWithdraw}
                  onRemovePendingDelayedWithdraw={onRemovePendingDelayedWithdraw}
                  coordinatorState={coordinatorStateTask?.data}
                  redirectTo={WithdrawRedirectionRoute.Home}
                />
          }
          {(() => {
            switch (accountsTask.status) {
              case 'pending':
              case 'loading':
              case 'failed': {
                return <Spinner />
              }
              case 'reloading':
              case 'successful': {
                if (accountsTask.data.accounts.length === 0 && pendingCreateAccountDeposits.length === 0) {
                  return (
                    <p className={classes.emptyAccounts}>
                      Deposit tokens from your Ethereum account.
                    </p>
                  )
                }

                return (
                  <>
                    {pendingCreateAccountDeposits && (
                      <PendingDepositList
                        deposits={pendingCreateAccountDeposits}
                        preferredCurrency={preferredCurrency}
                        fiatExchangeRates={fiatExchangeRatesTask.data}
                        onAccountClick={() => onOpenSnackbar('This token account is being created')}
                        coordinatorState={coordinatorStateTask?.data}
                      />
                    )}
                    <InfiniteScroll
                      asyncTaskStatus={accountsTask.status}
                      paginationData={accountsTask.data.pagination}
                      onLoadNextPage={(fromItem) => {
                        onLoadAccounts(
                          wallet.publicKeyBase64,
                          fromItem,
                          poolTransactionsTask.data,
                          accountPendingDeposits,
                          [...accountPendingWithdraws, ...accountPendingDelayedWithdraws],
                          fiatExchangeRatesTask.data,
                          preferredCurrency
                        )
                      }}
                    >
                      <AccountList
                        accounts={accountsTask.data.accounts}
                        preferredCurrency={preferredCurrency}
                        fiatExchangeRates={fiatExchangeRatesTask.data}
                        pendingDeposits={pendingOnTopDeposits}
                        onAccountClick={handleAccountClick}
                        coordinatorState={coordinatorStateTask?.data}
                      />
                    </InfiniteScroll>
                  </>
                )
              }
            }
          })()}
        </section>
      </Container>
      <ReportIssueButton />
    </div>
  )
}

Home.propTypes = {
  totalAccountsBalanceTask: PropTypes.object,
  accountsTask: PropTypes.object,
  preferredCurrency: PropTypes.string.isRequired,
  fiatExchangeRatesTask: PropTypes.object,
  poolTransactionsTask: PropTypes.object.isRequired,
  exitsTask: PropTypes.object.isRequired,
  pendingWithdraws: PropTypes.object.isRequired,
  pendingDelayedWithdraws: PropTypes.object.isRequired,
  onLoadTotalBalance: PropTypes.func.isRequired,
  onLoadAccounts: PropTypes.func.isRequired,
  onLoadPoolTransactions: PropTypes.func.isRequired,
  onLoadExits: PropTypes.func.isRequired,
  onAddPendingDelayedWithdraw: PropTypes.func.isRequired,
  onRemovePendingDelayedWithdraw: PropTypes.func.isRequired,
  onNavigateToAccountDetails: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  wallet: state.global.wallet,
  ethereumNetworkTask: state.global.ethereumNetworkTask,
  pendingDepositsCheckTask: state.global.pendingDepositsCheckTask,
  totalBalanceTask: state.home.totalBalanceTask,
  accountsTask: state.home.accountsTask,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask,
  preferredCurrency: state.myAccount.preferredCurrency,
  poolTransactionsTask: state.home.poolTransactionsTask,
  exitsTask: state.home.exitsTask,
  pendingWithdraws: state.global.pendingWithdraws,
  pendingDelayedWithdraws: state.global.pendingDelayedWithdraws,
  pendingDeposits: state.global.pendingDeposits,
  coordinatorStateTask: state.global.coordinatorStateTask,
  rewards: state.global.rewards
})

const mapDispatchToProps = (dispatch) => ({
  onChangeHeader: () =>
    dispatch(changeHeader({ type: 'main' })),
  onCheckPendingDeposits: () => dispatch(globalThunks.checkPendingDeposits()),
  onLoadTotalBalance: (hermezAddress, poolTransactions, pendingDeposits, fiatExchangeRates, preferredCurrency) =>
    dispatch(homeThunks.fetchTotalBalance(hermezAddress, poolTransactions, pendingDeposits, fiatExchangeRates, preferredCurrency)),
  onLoadAccounts: (hermezAddress, fromItem, poolTransactions, pendingDeposits, fiatExchangeRates, preferredCurrency) =>
    dispatch(homeThunks.fetchAccounts(hermezAddress, fromItem, poolTransactions, pendingDeposits, fiatExchangeRates, preferredCurrency)),
  onLoadPoolTransactions: () =>
    dispatch(homeThunks.fetchPoolTransactions()),
  onLoadExits: (exitTransactions) =>
    dispatch(homeThunks.fetchExits(exitTransactions)),
  onRefreshAccounts: () =>
    dispatch(homeThunks.refreshAccounts()),
  onAddPendingDelayedWithdraw: (pendingDelayedWithdraw) =>
    dispatch(globalThunks.addPendingDelayedWithdraw(pendingDelayedWithdraw)),
  onRemovePendingDelayedWithdraw: (pendingDelayedWithdrawId) =>
    dispatch(globalThunks.removePendingDelayedWithdraw(pendingDelayedWithdrawId)),
  onCheckPendingWithdrawals: () =>
    dispatch(globalThunks.checkPendingWithdrawals()),
  onCheckPendingDelayedWithdrawals: () =>
    dispatch(globalThunks.checkPendingDelayedWithdrawals()),
  onNavigateToAccountDetails: (accountIndex) =>
    dispatch(push(`/accounts/${accountIndex}`)),
  onOpenSnackbar: (message) =>
    dispatch(openSnackbar(message)),
  onOpenRewardsSidenav: () =>
    dispatch(globalActions.openRewardsSidenav()),
  onCleanup: () => dispatch(resetState())
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
