import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

const withAuth = (Component) => ({ metamaskWalletTask }) => {
  console.log(metamaskWalletTask)
  if (metamaskWalletTask.status === 'successful') {
    return <Component />
  } else {
    return <Redirect to='/' />
  }
}

const mapStateToProps = (state) => ({
  metamaskWalletTask: state.account.metamaskWalletTask
})

const withAuthGuard = (Component) => connect(mapStateToProps)(withAuth(Component))

export default withAuthGuard
