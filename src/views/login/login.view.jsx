import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { fetchConfig } from '../../store/global/global.thunks'
import { fetchMetamaskWallet } from '../../store/account/account.thunks'
import Spinner from '../shared/spinner/spinner.view'
import { Redirect } from 'react-router-dom'

function Login ({
  configTask,
  metaMaskWallet,
  onLoadConfig,
  onLoadMetaMaskWallet
}) {
  console.log(configTask)
  React.useEffect(() => {
    onLoadConfig()
  }, [onLoadConfig])

  function handleMetamaskLogin () {
    onLoadMetaMaskWallet()
  }

  return (
    <div>
      {(() => {
        switch (configTask.status) {
          case 'loading': {
            return <Spinner />
          }
          case 'failed': {
            return <p>{configTask.error}</p>
          }
          case 'successful': {
            switch (metaMaskWallet.status) {
              case 'pending':
              case 'failed': {
                return (
                  <>
                    {
                      metaMaskWallet.status === 'failed'
                        ? <p>{metaMaskWallet.error}</p>
                        : <></>
                    }
                    <button onClick={handleMetamaskLogin}>
                    Log In with Metamask
                    </button>
                  </>
                )
              }
              case 'loading': {
                return <Spinner />
              }
              case 'successful': {
                return <Redirect to='/' />
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
      })()}
    </div>
  )
}

Login.propTypes = {
  onLoadConfig: PropTypes.func.isRequired,
  onLoadMetaMaskWallet: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  configTask: state.global.configTask,
  metaMaskWallet: state.account.metaMaskWalletTask
})

const mapDispatchToProps = (dispatch) => ({
  onLoadConfig: () => dispatch(fetchConfig()),
  onLoadMetaMaskWallet: () => dispatch(fetchMetamaskWallet())
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
