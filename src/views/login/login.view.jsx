import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { useTheme } from 'react-jss'

import useLoginStyles from './login.styles'
import { fetchMetamaskWallet } from '../../store/global/global.thunks'
import { ReactComponent as HermezLogoAlternative } from '../../images/hermez-logo-alternative.svg'
import { ReactComponent as MetaMaskLogo } from '../../images/metamask-logo.svg'
import Container from '../shared/container/container.view'
import { changeHeader } from '../../store/global/global.actions'

function Login ({
  metaMaskWalletTask,
  redirectRoute,
  onLoadMetaMaskWallet,
  onChangeHeader
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
  function handleMetamaskLogin () {
    onLoadMetaMaskWallet()
  }

  return (
    <Container backgroundColor={theme.palette.primary.main} fullHeight>
      <div className={classes.root}>
        <HermezLogoAlternative className={classes.logo} />
        {
          metaMaskWalletTask.status === 'pending' || metaMaskWalletTask.status === 'failed'
            ? <h2 className={classes.connectText}>Connect with</h2>
            : <h2 className={classes.connectedText}>Connected to MetaMask</h2>
        }
        {
          metaMaskWalletTask.status === 'loading'
            ? (
              <div className={classes.walletContainer}>
                <MetaMaskLogo className={classes.walletButtonImage} />
              </div>
            )
            : (
              <button className={classes.walletButtonContainer} onClick={handleMetamaskLogin}>
                <MetaMaskLogo className={classes.walletButtonImage} />
              </button>
            )
        }
        {(() => {
          switch (metaMaskWalletTask.status) {
            case 'pending':
            case 'failed': {
              return <p className={classes.walletName}>MetaMask</p>
            }
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
  onLoadMetaMaskWallet: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  metaMaskWalletTask: state.global.metaMaskWalletTask,
  redirectRoute: state.global.redirectRoute
})

const mapDispatchToProps = (dispatch) => ({
  onChangeHeader: () => dispatch(changeHeader({ type: undefined })),
  onLoadMetaMaskWallet: () => dispatch(fetchMetamaskWallet())
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
