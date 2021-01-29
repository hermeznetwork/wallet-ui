import React from 'react'
import { connect } from 'react-redux'
import { useTheme } from 'react-jss'
import hermezjs from '@hermeznetwork/hermezjs'

import useLoginStyles from './login.styles'
import * as globalActions from '../../store/global/global.actions'
import * as loginActions from '../../store/login/login.actions'
import * as loginThunks from '../../store/login/login.thunks'
import { ReactComponent as HermezLogoAlternative } from '../../images/hermez-logo-alternative.svg'
import { ReactComponent as CloseIcon } from '../../images/icons/close.svg'
import Container from '../shared/container/container.view'
import { STEP_NAME } from '../../store/login/login.reducer'
import WalletButtonList from './components/wallet-button-list/wallet-button-list.view'
import AccountSelectorForm from './components/account-selector/account-selector-form.view'
import WalletLoader from './components/wallet-loader/wallet-loader.view'
import CreateAccountAuth from './components/create-account-auth/create-account-auth.view'
import Button from '../shared/button/button.view'
import { LOAD_ETHEREUM_NETWORK_ERROR } from '../../store/global/global.reducer'
import ChainIdError from './components/chain-id-error/chain-id-error.view'
import MetaMaskError from './components/metamask-error/metamask-error.view'
import { PRIVACY_POLICY_URL, TERMS_OF_SERVICE_URL } from '../../constants'

export const WalletName = {
  METAMASK: 'metaMask',
  LEDGER: 'ledger',
  TREZOR: 'trezor'
}

function Login ({
  currentStep,
  ethereumNetworkTask,
  steps,
  accountAuthTask,
  addAccountAuthTask,
  onChangeHeader,
  onGoToAccountSelectorStep,
  onGoToWalletLoaderStep,
  onGoToErrorStep,
  onGoToPreviousStep,
  onLoadWallet,
  onLoadCreateAccountAuthorization,
  onCreateAccountAuthorization,
  onCleanup
}) {
  const theme = useTheme()
  const classes = useLoginStyles()

  React.useEffect(() => {
    onChangeHeader()
  }, [onChangeHeader])

  React.useEffect(() => {
    if (ethereumNetworkTask.status === 'failure') {
      onGoToErrorStep(ethereumNetworkTask.error)
    }
  }, [ethereumNetworkTask, onGoToErrorStep])

  React.useEffect(() => onCleanup, [onCleanup])

  /**
   * Handles the click on the MetaMask button
   * @returns {void}
   */
  function handleWalletClick (walletName) {
    switch (walletName) {
      case WalletName.METAMASK: {
        return onGoToWalletLoaderStep(walletName)
      }
      case WalletName.LEDGER:
      case WalletName.TREZOR: {
        return onGoToAccountSelectorStep(walletName)
      }
      default: {}
    }
  }

  function capitalizeLabel (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  function handleSelectAccount (walletName, accountData) {
    onGoToWalletLoaderStep(walletName, accountData)
  }

  return (
    <Container backgroundColor={theme.palette.primary.main} fullHeight disableTopGutter>
      <div className={classes.root}>
        {currentStep !== STEP_NAME.WALLET_SELECTOR && currentStep !== STEP_NAME.ERROR && (
          <button className={classes.goBackButton} onClick={onGoToPreviousStep}>
            <CloseIcon />
          </button>
        )}
        <HermezLogoAlternative className={classes.logo} />
        {currentStep !== STEP_NAME.ERROR && (
          <p className={classes.description}>Secure wallet for low-cost token transfers</p>
        )}
        {
          ethereumNetworkTask.status === 'successful' && (
            <Button
              text={capitalizeLabel(ethereumNetworkTask.data.name)}
              className={classes.networkName}
            />
          )
        }
        {
          (() => {
            const stepData = steps[currentStep]

            switch (currentStep) {
              case STEP_NAME.WALLET_SELECTOR: {
                return (
                  <>
                    <h1 className={classes.connectText}>Connect with</h1>
                    <WalletButtonList onClick={handleWalletClick} />
                  </>
                )
              }
              case STEP_NAME.ACCOUNT_SELECTOR: {
                const walletLabel = capitalizeLabel(stepData.walletName)

                return (
                  <>
                    <h1 className={classes.addAccountText}>
                      Add account through {walletLabel}
                    </h1>
                    <AccountSelectorForm
                      walletName={stepData.walletName}
                      walletLabel={walletLabel}
                      onSelectAccount={handleSelectAccount}
                    />
                  </>
                )
              }
              case STEP_NAME.WALLET_LOADER: {
                const walletLabel = capitalizeLabel(stepData.walletName)

                return (
                  <>
                    <h1 className={classes.connectedText}>
                      Connected to {walletLabel}
                    </h1>
                    <WalletLoader
                      walletName={stepData.walletName}
                      accountData={stepData.accountData}
                      walletTask={stepData.walletTask}
                      onLoadWallet={onLoadWallet}
                    />
                  </>
                )
              }
              case STEP_NAME.CREATE_ACCOUNT_AUTH: {
                return (
                  <CreateAccountAuth
                    accountAuthTask={accountAuthTask}
                    addAccountAuthTask={addAccountAuthTask}
                    steps={steps}
                    onLoadCreateAccountAuthorization={onLoadCreateAccountAuthorization}
                    onCreateAccountAuthorization={onCreateAccountAuthorization}
                  />
                )
              }
              case STEP_NAME.ERROR: {
                switch (stepData.error) {
                  case LOAD_ETHEREUM_NETWORK_ERROR.METAMASK_NOT_INSTALLED: {
                    return <MetaMaskError />
                  }
                  case LOAD_ETHEREUM_NETWORK_ERROR.CHAIN_ID_NOT_SUPPORTED: {
                    const supportedEnvironments = hermezjs.Environment.getSupportedEnvironments()

                    return <ChainIdError supportedEnvironments={supportedEnvironments} />
                  }
                  default: {
                    return <></>
                  }
                }
              }
              default: {
                return <></>
              }
            }
          })()
        }
        <div className={classes.legalContainer}>
          <a
            href={PRIVACY_POLICY_URL}
            target='_blank'
            rel='noopener noreferrer'
            className={classes.privacyPolicyUrl}
          >
            Privacy policy
          </a>
          <p className={classes.legalSeparator}>|</p>
          <a
            href={TERMS_OF_SERVICE_URL}
            target='_blank'
            rel='noopener noreferrer'
            className={classes.termsOfServiceUrl}
          >
            Terms of service
          </a>
        </div>
      </div>
    </Container>
  )
}

const mapStateToProps = (state) => ({
  currentStep: state.login.currentStep,
  ethereumNetworkTask: state.global.ethereumNetworkTask,
  steps: state.login.steps,
  accountAuthTask: state.login.accountAuthTask,
  addAccountAuthTask: state.login.addAccountAuthTask
})

const mapDispatchToProps = (dispatch) => ({
  onChangeHeader: () =>
    dispatch(globalActions.changeHeader({ type: undefined })),
  onGoToAccountSelectorStep: (walletName) =>
    dispatch(loginActions.goToAccountSelectorStep(walletName)),
  onGoToWalletLoaderStep: (walletName, accountData) =>
    dispatch(loginActions.goToWalletLoaderStep(walletName, accountData)),
  onGoToErrorStep: (error) => dispatch(loginActions.goToErrorStep(error)),
  onGoToPreviousStep: () => dispatch(loginActions.goToPreviousStep()),
  onLoadWallet: (walletName, accountData) =>
    dispatch(loginThunks.fetchWallet(walletName, accountData)),
  onLoadCreateAccountAuthorization: (hermezEthereumAddress) =>
    dispatch(loginThunks.loadCreateAccountAuthorization(hermezEthereumAddress)),
  onCreateAccountAuthorization: (wallet) =>
    dispatch(loginThunks.postCreateAccountAuthorization(wallet)),
  onCleanup: () =>
    dispatch(loginActions.resetState())
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
