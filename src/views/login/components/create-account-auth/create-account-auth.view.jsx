import React from 'react'
import hermezjs from '@hermeznetwork/hermezjs'

import useCreateAccountAuthStyles from './create-account-auth.styles'
import Spinner from '../../../shared/spinner/spinner.view'
import { STEP_NAME } from '../../../../store/login/login.reducer'

function CreateAccountAuth ({
  accountAuth,
  steps,
  onCreateAccountAuthorization
}) {
  const classes = useCreateAccountAuthStyles()
  const wallet = steps[STEP_NAME.CREATE_ACCOUNT_AUTH].wallet

  React.useEffect(() => {
    onCreateAccountAuthorization(wallet)
  }, [onCreateAccountAuthorization, wallet])

  /**
   * Whether a create account authorization has been sent from current device for current coordinator
   * @param {Object} accountAuth - Existing local data of saved create account authorizations
   */
  function getCreateAccountAuthorization (accountAuth) {
    const currentAccountAuth = accountAuth[wallet.hermezEthereumAddress]
    return currentAccountAuth ? currentAccountAuth[hermezjs.CoordinatorAPI.getBaseApiUrl()] : false
  }

  return (
    !getCreateAccountAuthorization(accountAuth) ? (
      <div className={classes.accountAuth}>
        <h2 className={classes.accountAuthTitle}>Create accounts for new tokens</h2>
        <p className={classes.accountAuthText}>Confirm with your signature that Hermez will automatically create accounts for your new tokens.</p>
        <Spinner />
      </div>
    )
      : <></>
  )
}

export default CreateAccountAuth
