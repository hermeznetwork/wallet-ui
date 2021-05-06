import React from 'react'

import useCreateAccountAuthStyles from './create-account-auth.styles'
import Spinner from '../../../shared/spinner/spinner.view'
import { STEP_NAME } from '../../../../store/login/login.reducer'

function CreateAccountAuth ({
  hermezAddressAuthSignature,
  addAccountAuthTask,
  steps,
  onCreateAccountAuthorization
}) {
  const classes = useCreateAccountAuthStyles()
  const wallet = steps[STEP_NAME.CREATE_ACCOUNT_AUTH].wallet

  React.useEffect(() => {
    onCreateAccountAuthorization(wallet)
  }, [wallet, onCreateAccountAuthorization])

  if (!hermezAddressAuthSignature) {
    return (
      <div className={classes.accountAuth}>
        <h2 className={classes.accountAuthTitle}>Create accounts for new tokens</h2>
        <p className={classes.accountAuthText}>Confirm with your signature that Hermez will automatically create accounts for your new tokens.</p>
        <Spinner />
      </div>
    )
  } else {
    return <Spinner />
  }
}

export default CreateAccountAuth
