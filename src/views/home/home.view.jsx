import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useTheme } from 'react-jss'
import { push } from 'connected-react-router'
import { AUTO_REFRESH_RATE } from '../../constants'
import { getEthereumAddress } from '@hermeznetwork/hermezjs/src/addresses'

import useHomeStyles from './home.styles'
import * as globalThunks from '../../store/global/global.thunks'
import * as homeThunks from '../../store/home/home.thunks'
import FiatAmount from '../shared/fiat-amount/fiat-amount.view'
import AccountList from '../shared/account-list/account-list.view'
import Spinner from '../shared/spinner/spinner.view'
import withAuthGuard from '../shared/with-auth-guard/with-auth-guard.view.jsx'
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
import ReportIssueButton from './components/report-issue-button/report-issue-button.view'
import Sidenav from '../shared/sidenav/sidenav.view'
import AirdropPanel from '../shared/airdrop-panel/airdrop-panel.view'

function Home ({
  wallet,
  ethereumNetworkTask,
  pendingDepositsCheckTask,
  totalBalanceTask,
  accountsTask,
  poolTransactionsTask,
  exitsTask,
  estimatedRewardTask,
  earnedRewardTask,
  fiatExchangeRatesTask,
  preferredCurrency,
  pendingDeposits,
  pendingWithdraws,
  pendingDelayedWithdraws,
  coordinatorStateTask,
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
  onCheckPendingDelayedWithdraw,
  onCheckPendingWithdrawals,
  onNavigateToAccountDetails,
  onOpenSnackbar,
  onCleanup,
  onClose
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
    onLoadEstimatedReward()
    onLoadEarnedReward()
  }, [onCheckPendingDeposits, onLoadPoolTransactions, onLoadExits, onLoadEstimatedReward, onLoadEarnedReward])

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      onCheckPendingDeposits()
      onLoadPoolTransactions()
      onLoadExits()
      onCheckPendingWithdrawals()
    }, AUTO_REFRESH_RATE)

    return () => { clearInterval(intervalId) }
  }, [onLoadPoolTransactions])

  React.useEffect(() => {
    if (
      pendingDepositsCheckTask.status === 'successful' &&
      poolTransactionsTask.status === 'successful' &&
      fiatExchangeRatesTask.status === 'successful'
    ) {
      onLoadTotalBalance(
        wallet.hermezEthereumAddress,
        poolTransactionsTask.data,
        accountPendingDeposits,
        fiatExchangeRatesTask.data,
        preferredCurrency
      )
      onLoadAccounts(
        wallet.hermezEthereumAddress,
        undefined,
        poolTransactionsTask.data,
        accountPendingDeposits,
        fiatExchangeRatesTask.data,
        preferredCurrency
      )
    }
  }, [pendingDepositsCheckTask, poolTransactionsTask, fiatExchangeRatesTask, wallet, onLoadTotalBalance, onLoadAccounts])

  React.useEffect(() => {
    onLoadEstimatedReward(
      getEthereumAddress(wallet.hermezEthereumAddress)
    )
    onLoadEarnedReward(
      getEthereumAddress(wallet.hermezEthereumAddress)
    )
  }, [onLoadEstimatedReward, onLoadEarnedReward])

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
      {
        estimatedRewardTask.status === 'successful' && earnedRewardTask.status === 'successful' 
          ? <Sidenav onClose={onClose}>
              <AirdropPanel estimatedReward={estimatedRewardTask.data} earnedReward={earnedRewardTask.data}/>
            </Sidenav>
          : <></>
      }
      <Container backgroundColor={theme.palette.primary.main} addHeaderPadding disableTopGutter>
        <section className={classes.section}>
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
                  onCheckPendingDelayedWithdraw={onCheckPendingDelayedWithdraw}
                  redirectTo={WithdrawRedirectionRoute.Home}
                />
              : <></>
          }
          {
            exitsTask.status === 'successful' || exitsTask.status === 'reloading'
              ? <ExitList
                  transactions={exitsTask.data.exits}
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
                  onCheckPendingDelayedWithdraw={onCheckPendingDelayedWithdraw}
                  redirectTo={WithdrawRedirectionRoute.Home}
                />
              : <></>
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
                          wallet.hermezEthereumAddress,
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
  estimatedRewardTask: PropTypes.object.isRequired,
  earnedRewardTask: PropTypes.object.isRequired,
  pendingWithdraws: PropTypes.object.isRequired,
  pendingDelayedWithdraws: PropTypes.object.isRequired,
  onLoadTotalBalance: PropTypes.func.isRequired,
  onLoadAccounts: PropTypes.func.isRequired,
  onLoadPoolTransactions: PropTypes.func.isRequired,
  onLoadExits: PropTypes.func.isRequired,
  onLoadEstimatedReward: PropTypes.func.isRequired,
  onLoadEarnedReward: PropTypes.func.isRequired,
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
  estimatedRewardTask: state.global.estimatedRewardTask,
  earnedRewardTask: state.global.earnedRewardTask,
  pendingWithdraws: state.global.pendingWithdraws,
  pendingDelayedWithdraws: state.global.pendingDelayedWithdraws,
  pendingDeposits: state.global.pendingDeposits,
  coordinatorStateTask: state.global.coordinatorStateTask
})

const mapDispatchToProps = (dispatch) => ({
  onChangeHeader: () =>
    dispatch(changeHeader({ type: 'main' })),
  onCheckPendingDeposits: () => dispatch(globalThunks.checkPendingDeposits()),
  onLoadTotalBalance: (hermezEthereumAddress, poolTransactions, pendingDeposits, fiatExchangeRates, preferredCurrency) =>
    dispatch(homeThunks.fetchTotalBalance(hermezEthereumAddress, poolTransactions, pendingDeposits, fiatExchangeRates, preferredCurrency)),
  onLoadAccounts: (hermezEthereumAddress, fromItem, poolTransactions, pendingDeposits, fiatExchangeRates, preferredCurrency) =>
    dispatch(homeThunks.fetchAccounts(hermezEthereumAddress, fromItem, poolTransactions, pendingDeposits, fiatExchangeRates, preferredCurrency)),
  onLoadPoolTransactions: () =>
    dispatch(homeThunks.fetchPoolTransactions()),
  onLoadExits: (exitTransactions) =>
    dispatch(homeThunks.fetchExits(exitTransactions)),
  onRefreshAccounts: () =>
    dispatch(homeThunks.refreshAccounts()),
  onLoadEstimatedReward: (ethAddr) =>
    dispatch(globalThunks.fetchEstimatedReward(ethAddr)),
  onLoadEarnedReward: (ethAddr) =>
    dispatch(globalThunks.fetchEarnedReward(ethAddr)),
  onAddPendingDelayedWithdraw: (pendingDelayedWithdraw) =>
    dispatch(globalThunks.addPendingDelayedWithdraw(pendingDelayedWithdraw)),
  onRemovePendingDelayedWithdraw: (pendingDelayedWithdrawId) =>
    dispatch(globalThunks.removePendingDelayedWithdraw(pendingDelayedWithdrawId)),
  onCheckPendingDelayedWithdraw: (exitId) =>
    dispatch(globalThunks.checkPendingDelayedWithdraw(exitId)),
  onCheckPendingWithdrawals: () =>
    dispatch(globalThunks.checkPendingWithdrawals()),
  onNavigateToAccountDetails: (accountIndex) =>
    dispatch(push(`/accounts/${accountIndex}`)),
  onOpenSnackbar: (message) =>
    dispatch(openSnackbar(message)),
  onCleanup: () => dispatch(resetState())
})

export default withAuthGuard(connect(mapStateToProps, mapDispatchToProps)(Home))
