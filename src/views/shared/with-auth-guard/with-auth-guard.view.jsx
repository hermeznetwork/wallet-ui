import React from 'react'
import { connect } from 'react-redux'
import { Redirect, useLocation } from 'react-router-dom'

import { changeRedirectRoute } from '../../../store/global/global.thunks'

const withAuth = (Component) => ({ wallet, onChangeRedirectRoute, ...props }) => {
  const { pathname, search } = useLocation()

  if (wallet) {
    return <Component {...props} />
  } else {
    const currentRoute = `${pathname}${search}`

    onChangeRedirectRoute(currentRoute)

    return <Redirect to='/login' />
  }
}

const mapStateToProps = (state) => ({
  wallet: state.global.wallet
})

const mapDispatchToProps = (dispatch) => ({
  onChangeRedirectRoute: (redirectRoute) => dispatch(changeRedirectRoute(redirectRoute))
})

const withAuthGuard = (Component) => (props) => {
  const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(withAuth(Component))

  return <ConnectedComponent {...props} />
}

export default withAuthGuard
