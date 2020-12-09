import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { useTheme } from 'react-jss'

import useLoginStyles from './login.styles'
import * as globalThunks from '../../store/global/global.thunks'
import { ReactComponent as HermezLogoAlternative } from '../../images/hermez-logo-alternative.svg'
import Container from '../shared/container/container.view'
import { changeHeader } from '../../store/global/global.actions'
import { STEP_NAME } from '../../store/login/login.reducer'
import WalletButtonList from './components/wallet-button-list/wallet-button-list.view'
import AccountSelector from './components/account-selector/account-selector.view'
import { goToAccountSelectorStep } from '../../store/login/login.actions'

function Login ({
  currentStep,
  steps,
  walletTask,
  redirectRoute,
  onChangeHeader,
  onLoadMetaMaskWallet,
  onLoadLedgerWallet,
  onLoadTrezorWallet,
  onGoToAccountSelectorStep
}) {
  const theme = useTheme()
  const classes = useLoginStyles()

  React.useEffect(() => {
    onChangeHeader()
  }, [onChangeHeader])

  /**
   * Handles the click on the MetaMask button
   * @returns {void}
   */
  function handleWalletClick (walletName) {
    switch (walletName) {
      case 'metamask': {
        return onLoadMetaMaskWallet()
      }
      case 'ledger':
      case 'trezor': {
        return onGoToAccountSelectorStep(walletName)
      }
      default: {}
    }
  }

  function getWalletLabel (walletName) {
    return walletName[0].toUpperCase() + walletName.slice(1)
  }

  return (
    <Container backgroundColor={theme.palette.primary.main} fullHeight>
      <div className={classes.root}>
        <HermezLogoAlternative className={classes.logo} />
        {
          (() => {
            switch (currentStep) {
              case STEP_NAME.WALLET_SELECTOR: {
                return (
                  <>
                    <h1 className={classes.connectText}>Connect with</h1>
                    {/* <h2 className={classes.connectedText}>Connected to MetaMask</h2> */}
                    <WalletButtonList onClick={handleWalletClick} />
                  </>
                )
              }
              case STEP_NAME.ACCOUNT_SELECTOR: {
                const stepData = steps[STEP_NAME.ACCOUNT_SELECTOR]
                const walletLabel = getWalletLabel(stepData.walletName)

                return (
                  <>
                    <h1 className={classes.addAccountText}>
                      Add account through {walletLabel}
                    </h1>
                    <AccountSelector walletLabel={walletLabel} />
                  </>
                )
              }
              default: {
                return <></>
              }
            }
          })()
        }
        {(() => {
          switch (walletTask.status) {
            case 'loading': {
              return (
                <p className={classes.helperText}>
                Follow the instructions in the pop up.
                </p>
              )
            }
            case 'successful': {
              return <Redirect to={redirectRoute} />
            }
            default: {
              return <></>
            }
          }
        })()}
      </div>
    </Container>
  )
}

Login.propTypes = {
  onLoadMetaMaskWallet: PropTypes.func.isRequired,
  onLoadLedgerWallet: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  currentStep: state.login.currentStep,
  steps: state.login.steps,
  walletTask: state.global.metaMaskWalletTask,
  redirectRoute: state.global.redirectRoute
})

const mapDispatchToProps = (dispatch) => ({
  onChangeHeader: () => dispatch(changeHeader({ type: undefined })),
  onGoToAccountSelectorStep: (walletName) => dispatch(goToAccountSelectorStep(walletName)),
  onLoadMetaMaskWallet: () => dispatch(globalThunks.fetchMetamaskWallet()),
  onLoadLedgerWallet: () => dispatch(globalThunks.fetchLedgerWallet()),
  onLoadTrezorWallet: () => dispatch(globalThunks.fetchTrezorWallet())
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
