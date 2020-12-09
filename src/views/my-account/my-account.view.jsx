import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useTheme } from 'react-jss'
import { push } from 'connected-react-router'

import useMyAccountStyles from './my-account.styles'
import { changeHeader, openSnackbar } from '../../store/global/global.actions'
import { changePreferredCurrency, disconnectMetaMaskWallet } from '../../store/my-account/my-account.thunks'
import Container from '../shared/container/container.view'
import withAuthGuard from '../shared/with-auth-guard/with-auth-guard.view'
import { ReactComponent as ExchangeIcon } from '../../images/icons/exchange.svg'
import { ReactComponent as ExitIcon } from '../../images/icons/exit.svg'
import { ReactComponent as OpenInNewTabIcon } from '../../images/icons/open-in-new-tab.svg'
import { ReactComponent as PowerOffIcon } from '../../images/icons/power-off.svg'
import { CurrencySymbol } from '../../utils/currencies'
import PreferredCurrencySelector from './components/preferred-currency-selector/preferred-currency-selector.view'
import { getPartiallyHiddenHermezAddress } from '../../utils/addresses'
import { ReactComponent as CopyIcon } from '../../images/icons/copy.svg'
import Button from '../shared/button/button.view'
import { copyToClipboard } from '../../utils/browser'
import { ReactComponent as QRCodeIcon } from '../../images/icons/qr-code.svg'

function MyAccount ({
  metaMaskWalletTask,
  preferredCurrency,
  onChangeHeader,
  onChangePreferredCurrency,
  onDisconnectWallet,
  onOpenSnackbar,
  onNavigateToForceExit,
  onNavigateToMyCode
}) {
  const theme = useTheme()
  const classes = useMyAccountStyles()

  React.useEffect(() => {
    onChangeHeader()
  }, [onChangeHeader])

  /**
   * Copies the Hermez Ethereum address to the clipboard when it's clicked
   * @param {string} hermezEthereumAddress - Hermez ethereum address
   * @returns {void}
   */
  function handleEthereumAddressClick (hermezEthereumAddress) {
    copyToClipboard(hermezEthereumAddress)
    onOpenSnackbar('The Hermez address has been copied to the clipboard!')
  }

  /**
   * Disconnects the currently connected MetaMask wallet when the disconnect wallet button
   * is clicked
   * @returns {void}
   */
  function handleOnDisconnectWallet () {
    onDisconnectWallet()
  }

  return (
    <div className={classes.root}>
      <Container backgroundColor={theme.palette.primary.main} disableTopGutter addHeaderPadding>
        <section className={classes.topSection}>
          {metaMaskWalletTask.status === 'successful' && (
            <>
              <h1 className={classes.hermezEthereumAddress}>
                {getPartiallyHiddenHermezAddress(metaMaskWalletTask.data.hermezEthereumAddress)}
              </h1>
              <div className={classes.buttonsWrapper}>
                <Button
                  text='Show QR'
                  className={classes.qrButton}
                  Icon={<QRCodeIcon className={classes.qrIcon} />}
                  onClick={onNavigateToMyCode}
                />
                <Button
                  text='Copy'
                  Icon={<CopyIcon />}
                  onClick={() => handleEthereumAddressClick(metaMaskWalletTask.data.hermezEthereumAddress)}
                />
              </div>
            </>
          )}
        </section>
      </Container>
      <Container>
        <section className={classes.bottomSection}>
          <div className={classes.settingContainer}>
            <div className={classes.settingHeader}>
              <ExchangeIcon />
              <p className={classes.settingTitle}>Currency conversion</p>
            </div>
            <div className={classes.settingContent}>
              <PreferredCurrencySelector
                preferredCurrency={preferredCurrency}
                currencies={Object.values(CurrencySymbol)}
                onChange={onChangePreferredCurrency}
              />
            </div>
          </div>
          <div className={classes.settingContainer}>
            <div className={classes.settingHeader}>
              <ExitIcon />
              <p className={classes.settingTitle} onClick={onNavigateToForceExit}>Force withdrawal</p>
            </div>
          </div>
          {metaMaskWalletTask.status === 'successful' && (
            <a
              className={classes.settingContainer}
              href={`${process.env.REACT_APP_BATCH_EXPLORER_URL}/address/${metaMaskWalletTask.data.hermezEthereumAddress}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <div className={classes.settingHeader}>
                <OpenInNewTabIcon />
                <p className={classes.settingTitle}>View in batch explorer</p>
              </div>
            </a>
          )}
          <button
            className={classes.settingContainer}
            onClick={handleOnDisconnectWallet}
          >
            <div className={classes.settingHeader}>
              <PowerOffIcon />
              <p className={classes.settingTitle}>Disconnect wallet</p>
            </div>
          </button>
        </section>
      </Container>
    </div>
  )
}

MyAccount.propTypes = {
  onChangePreferredCurrency: PropTypes.func
}

const mapStateToProps = (state) => ({
  metaMaskWalletTask: state.global.metaMaskWalletTask,
  preferredCurrency: state.myAccount.preferredCurrency
})

const mapDispatchToProps = (dispatch) => ({
  onChangeHeader: () =>
    dispatch(changeHeader({
      type: 'page',
      data: {
        title: 'My Account',
        goBackAction: push('/')
      }
    })),
  onNavigateToMyCode: () =>
    dispatch(push('/my-code?from=my-account')),
  onChangePreferredCurrency: (currency) => dispatch(changePreferredCurrency(currency)),
  onDisconnectWallet: () => dispatch(disconnectMetaMaskWallet()),
  onOpenSnackbar: (message) => dispatch(openSnackbar(message)),
  onNavigateToForceExit: () => dispatch(push('/force-withdrawal'))
})

export default withAuthGuard(connect(mapStateToProps, mapDispatchToProps)(MyAccount))