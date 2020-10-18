import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { useTheme } from 'react-jss'

import useLoginStyles from './login.styles'
import { fetchMetamaskWallet } from '../../store/account/account.thunks'
import hermezLogoAlternative from '../../images/hermez-logo-alternative.svg'
import metaMaskLogo from '../../images/metamask-logo.svg'
import Container from '../shared/container/container.view'

function Login ({
  metaMaskWalletTask,
  redirectRoute,
  onLoadMetaMaskWallet
}) {
  const theme = useTheme()
  const classes = useLoginStyles()

  function handleMetamaskLogin () {
    onLoadMetaMaskWallet()
  }

  return (
    <Container backgroundColor={theme.palette.primary.main} fullHeight>
      <div className={classes.root}>
        <img src={hermezLogoAlternative} alt='Hermez logo' className={classes.logo} />
        {
          metaMaskWalletTask.status === 'pending' || metaMaskWalletTask.status === 'failed'
            ? <h2 className={classes.connectText}>Connect with</h2>
            : <h2 className={classes.connectedText}>Connected to MetaMask</h2>
        }
        <button className={classes.walletButton} onClick={handleMetamaskLogin}>
          <img src={metaMaskLogo} alt='MetaMask logo' className={classes.walletButtonImage} />
        </button>
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
  metaMaskWalletTask: state.account.metaMaskWalletTask,
  redirectRoute: state.global.redirectRoute
})

const mapDispatchToProps = (dispatch) => ({
  onLoadMetaMaskWallet: () => dispatch(fetchMetamaskWallet())
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
