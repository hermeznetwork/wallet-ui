import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

const withAuth = (Component) => ({ metaMaskWalletTask }) => {
  if (metaMaskWalletTask.status === 'successful') {
    return <Component />
  } else {
    return <Redirect to='/login' />
  }
}

const mapStateToProps = (state) => ({
  metaMaskWalletTask: state.account.metaMaskWalletTask
})

const withAuthGuard = (Component) => connect(mapStateToProps)(withAuth(Component))

export default withAuthGuard
