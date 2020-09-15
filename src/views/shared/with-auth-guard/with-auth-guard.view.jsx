import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

const withAuth = (Component) => ({ metaMaskWalletTask, ...props }) => {
  if (metaMaskWalletTask.status === 'successful') {
    return <Component {...props} />
  } else {
    return <Redirect to='/login' />
  }
}

const mapStateToProps = (state) => ({
  metaMaskWalletTask: state.account.metaMaskWalletTask
})

const withAuthGuard = (Component) => (props) => {
  const ConnectedComponent = connect(mapStateToProps)(withAuth(Component))

  return <ConnectedComponent {...props} />
}

export default withAuthGuard
