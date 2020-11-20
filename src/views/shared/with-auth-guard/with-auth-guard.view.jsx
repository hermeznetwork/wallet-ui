import React from 'react'
import { connect } from 'react-redux'
import { Redirect, useLocation } from 'react-router-dom'

import { changeRedirectRoute } from '../../../store/global/global.thunks'

const withAuth = (Component) => ({ metaMaskWalletTask, onChangeRedirectRoute, ...props }) => {
  const { pathname: currentRoute } = useLocation()

  if (metaMaskWalletTask.status === 'successful') {
    return <Component {...props} />
  } else {
    onChangeRedirectRoute(currentRoute)
    return <Redirect to='/login' />
  }
}

const mapStateToProps = (state) => ({
  metaMaskWalletTask: state.global.metaMaskWalletTask
})

const mapDispatchToProps = (dispatch) => ({
  onChangeRedirectRoute: (redirectRoute) => dispatch(changeRedirectRoute(redirectRoute))
})

const withAuthGuard = (Component) => (props) => {
  const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(withAuth(Component))

  return <ConnectedComponent {...props} />
}

export default withAuthGuard
