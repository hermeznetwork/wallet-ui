import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useTheme } from 'react-jss'
import { push } from 'connected-react-router'

import useSettingsStyles from './settings.styles'
import { changeHeader, openSnackbar } from '../../store/global/global.actions'
import { changePreferredCurrency, disconnectMetaMaskWallet } from '../../store/settings/settings.thunks'
import Container from '../shared/container/container.view'
import withAuthGuard from '../shared/with-auth-guard/with-auth-guard.view'
import exchangeIcon from '../../images/icons/exchange.svg'
import exitIcon from '../../images/icons/exit.svg'
import openInNewTabIcon from '../../images/icons/open-in-new-tab.svg'
import powerOffIcon from '../../images/icons/power-off.svg'
import { CurrencySymbol } from '../../utils/currencies'
import PreferredCurrencySelector from './components/preferred-currency-selector/preferred-currency-selector.view'
import { getPartiallyHiddenHermezAddress } from '../../utils/addresses'
import { ReactComponent as CopyIcon } from '../../images/icons/copy.svg'
import Button from '../shared/button/button.view'
import { copyToClipboard } from '../../utils/dom'

function Settings ({
  metaMaskWalletTask,
  preferredCurrency,
  onChangeHeader,
  onChangePreferredCurrency,
  onDisconnectWallet,
  onOpenSnackbar,
  onNavigateToForceExit
}) {
  const theme = useTheme()
  const classes = useSettingsStyles()

  React.useEffect(() => {
    onChangeHeader()
  }, [onChangeHeader])

  function handleEthereumAddressClick (hermezEthereumAddress) {
    copyToClipboard(hermezEthereumAddress)
    onOpenSnackbar('The Hermez address has been copied to the clipboard!')
  }

  function handleOnDisconnectWallet () {
    onDisconnectWallet()
  }

  return (
    <div className={classes.root}>
      <Container backgroundColor={theme.palette.primary.main} disableTopGutter>
        <section className={classes.topSection}>
          {
            metaMaskWalletTask.status === 'successful'
              ? (
                <>
                  <h1 className={classes.hermezEthereumAddress}>
                    {getPartiallyHiddenHermezAddress(metaMaskWalletTask.data.hermezEthereumAddress)}
                  </h1>
                  <Button
                    text='Copy'
                    Icon={<CopyIcon />}
                    onClick={() => handleEthereumAddressClick(metaMaskWalletTask.data.hermezEthereumAddress)}
                  />
                </>
              )
              : <></>
          }
        </section>
      </Container>
      <Container>
        <section className={classes.bottomSection}>
          <div className={classes.settingContainer}>
            <div className={classes.settingHeader}>
              <img src={exchangeIcon} alt='Currency conversion' />
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
              <img src={exitIcon} alt='Force withdrawal' />
              <p className={classes.settingTitle} onClick={onNavigateToForceExit}>Force withdrawal</p>
            </div>
          </div>
          {
            metaMaskWalletTask.status === 'successful'
              ? (
                <a
                  className={classes.settingContainer}
                  href={`${process.env.REACT_APP_BATCH_EXPLORER_URL}/address/${metaMaskWalletTask.data.hermezEthereumAddress}`}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <div className={classes.settingHeader}>
                    <img src={openInNewTabIcon} alt='View in batch explorer' />
                    <p className={classes.settingTitle}>View in batch explorer</p>
                  </div>
                </a>
              )
              : <></>
          }
          <button
            className={classes.settingContainer}
            onClick={handleOnDisconnectWallet}
          >
            <div className={classes.settingHeader}>
              <img src={powerOffIcon} alt='Disconnect wallet' />
              <p className={classes.settingTitle}>Disconnect wallet</p>
            </div>
          </button>
        </section>
      </Container>
    </div>
  )
}

Settings.propTypes = {
  onChangePreferredCurrency: PropTypes.func
}

const mapStateToProps = (state) => ({
  metaMaskWalletTask: state.account.metaMaskWalletTask,
  preferredCurrency: state.settings.preferredCurrency
})

const mapDispatchToProps = (dispatch) => ({
  onChangeHeader: (tokenName) =>
    dispatch(changeHeader({ type: 'page', data: { title: 'Settings', previousRoute: '/' } })),
  onChangePreferredCurrency: (currency) => dispatch(changePreferredCurrency(currency)),
  onDisconnectWallet: () => dispatch(disconnectMetaMaskWallet()),
  onOpenSnackbar: (message) => dispatch(openSnackbar(message)),
  onNavigateToForceExit: () => dispatch(push('/force-withdrawal'))
})

export default withAuthGuard(connect(mapStateToProps, mapDispatchToProps)(Settings))
