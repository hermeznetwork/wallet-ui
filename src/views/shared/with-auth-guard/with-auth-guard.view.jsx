import React from 'react'
import { connect } from 'react-redux'
import { Redirect, useLocation } from 'react-router-dom'

import { changeRedirectRoute } from '../../../store/global/global.thunks'

const withAuth = (Component) => ({ metaMaskWalletTask, onChangeRedirectRoute }) => {
  onChangeRedirectRoute(useLocation().pathname)

  if (metaMaskWalletTask.status === 'successful') {
    return <Component />
  } else {
    return <Redirect to='/login' />
  }
}

const mapStateToProps = (state) => ({
  metaMaskWalletTask: state.account.metaMaskWalletTask
})

const mapDispatchToProps = (dispatch) => ({
  onChangeRedirectRoute: (redirectRoute) => dispatch(changeRedirectRoute(redirectRoute))
})

const withAuthGuard = (Component) => connect(mapStateToProps, mapDispatchToProps)(withAuth(Component))

export default withAuthGuard
