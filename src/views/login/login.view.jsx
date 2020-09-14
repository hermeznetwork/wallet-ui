import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { fetchMetamaskWallet } from '../../store/account/account.thunks'
import Spinner from '../shared/spinner/spinner.view'
import { Redirect } from 'react-router-dom'

function Login ({
  metaMaskWallet,
  redirectRoute,
  onLoadMetaMaskWallet
}) {
  function handleMetamaskLogin () {
    onLoadMetaMaskWallet()
  }

  return (
    <div>
      {(() => {
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
            return <Redirect to={redirectRoute} />
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
  onLoadMetaMaskWallet: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  metaMaskWallet: state.account.metaMaskWalletTask,
  redirectRoute: state.global.redirectRoute
})

const mapDispatchToProps = (dispatch) => ({
  onLoadMetaMaskWallet: () => dispatch(fetchMetamaskWallet())
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
