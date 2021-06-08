import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useTheme } from 'react-jss'
import { push } from 'connected-react-router'
import hermezjs from '@hermeznetwork/hermezjs'
import { getEthereumAddress } from '@hermeznetwork/hermezjs/src/addresses'

import useMyAccountStyles from './my-account.styles'
import { changeHeader, openSnackbar } from '../../store/global/global.actions'
import { changePreferredCurrency } from '../../store/my-account/my-account.thunks'
import * as globalThunks from '../../store/global/global.thunks'
import { disconnectWallet } from '../../store/global/global.thunks'
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
import { version as packagejsonVersion } from '../../../package.json'
import Sidenav from '../shared/sidenav/sidenav.view'
import AirdropPanel from '../shared/airdrop-panel/airdrop-panel.view'

function MyAccount ({
  wallet,
  preferredCurrency,
  onChangeHeader,
  onChangePreferredCurrency,
  onDisconnectWallet,
  onOpenSnackbar,
  onNavigateToForceExit,
  onNavigateToMyCode,
  estimatedRewardTask,
  earnedRewardTask,
  onLoadEstimatedReward,
  onLoadEarnedReward,
  onClose
}) {
  const theme = useTheme()
  const classes = useMyAccountStyles()

  React.useEffect(() => {
    onChangeHeader()
    onLoadEstimatedReward(getEthereumAddress(wallet.hermezEthereumAddress))
    onLoadEarnedReward(getEthereumAddress(wallet.hermezEthereumAddress))
  }, [onChangeHeader, onLoadEstimatedReward, onLoadEarnedReward])

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
      {
        estimatedRewardTask.status === 'successful' && earnedRewardTask.status === 'successful' 
          ? <Sidenav onClose={onClose}>
              <AirdropPanel estimatedReward={estimatedRewardTask.data} earnedReward={earnedRewardTask.data}/>
            </Sidenav>
          : <></>
      }
      <Container backgroundColor={theme.palette.primary.main} disableTopGutter addHeaderPadding>
        <section className={classes.topSection}>
          {wallet && (
            <>
              <h1 className={classes.hermezEthereumAddress}>
                {getPartiallyHiddenHermezAddress(wallet.hermezEthereumAddress)}
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
                  onClick={() => handleEthereumAddressClick(wallet.hermezEthereumAddress)}
                />
              </div>
            </>
          )}
        </section>
      </Container>
      {
        estimatedRewardTask.status === 'successful' && earnedRewardTask.status === 'successful' 
          ? <Container>
              <div className={classes.airdropCard}>
                <div className={classes.cardHeader}>
                  <h3 className={classes.cardHeading}>Your earnings</h3>
                  <Button
                    className={classes.moreInfo}
                    text='More Info'
                    // TODO: onClick open panel
                    onClick={() => {}}
                  />
                </div>
                <p className={classes.rewardText}>Today’s reward is <span className={classes.rewardPercentage}>+48%</span> so you can receive {estimatedRewardTask.data} HEZ</p>
                <p className={classes.rewardText}>You earned so far {earnedRewardTask.data} HEZ</p>
              </div>
            </Container>
          : <></>
      }      
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
            <div className={classes.settingHeader} onClick={onNavigateToForceExit}>
              <ExitIcon />
              <p className={classes.settingTitle}>Force withdrawal</p>
              <p className={classes.settingSubTitle}>Forces the coordinator to process the transaction (more Gas is required).</p>
            </div>
          </div>
          {wallet && (
            <a
              className={classes.settingContainer}
              href={`${hermezjs.Environment.getBatchExplorerUrl()}/user-account/${wallet.hermezEthereumAddress}`}
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
  onChangePreferredCurrency: PropTypes.func,
  estimatedRewardTask: PropTypes.object.isRequired,
  earnedRewardTask: PropTypes.object.isRequired,
  onLoadEstimatedReward: PropTypes.func.isRequired,
  onLoadEarnedReward: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  wallet: state.global.wallet,
  preferredCurrency: state.myAccount.preferredCurrency,
  estimatedRewardTask: state.global.rewards.estimatedRewardTask,
  earnedRewardTask: state.global.rewards.earnedRewardTask
})

const mapDispatchToProps = (dispatch) => ({
  onChangeHeader: () =>
    dispatch(changeHeader({
      type: 'page',
      data: {
        title: 'My Account',
        subtitle: `version ${packagejsonVersion}`,
        goBackAction: push('/')
      }
    })),
  onNavigateToMyCode: () =>
    dispatch(push('/my-code?from=my-account')),
  onChangePreferredCurrency: (currency) => dispatch(changePreferredCurrency(currency)),
  onDisconnectWallet: () => dispatch(disconnectWallet()),
  onOpenSnackbar: (message) => dispatch(openSnackbar(message)),
  onNavigateToForceExit: () => dispatch(push('/force-withdrawal')),
  onLoadEstimatedReward: (ethAddr) =>
    dispatch(globalThunks.fetchEstimatedReward(ethAddr)),
  onLoadEarnedReward: (ethAddr) =>
    dispatch(globalThunks.fetchEarnedReward(ethAddr))
})

export default withAuthGuard(connect(mapStateToProps, mapDispatchToProps)(MyAccount))
