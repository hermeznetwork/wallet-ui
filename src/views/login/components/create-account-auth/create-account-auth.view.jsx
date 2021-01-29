import React from 'react'

import useCreateAccountAuthStyles from './create-account-auth.styles'
import Spinner from '../../../shared/spinner/spinner.view'
import { STEP_NAME } from '../../../../store/login/login.reducer'

function CreateAccountAuth ({
  accountAuthTask,
  addAccountAuthTask,
  steps,
  onLoadCreateAccountAuthorization,
  onCreateAccountAuthorization
}) {
  const classes = useCreateAccountAuthStyles()
  const wallet = steps[STEP_NAME.CREATE_ACCOUNT_AUTH].wallet

  React.useEffect(() => {
    onLoadCreateAccountAuthorization(wallet.hermezEthereumAddress)
  }, [onLoadCreateAccountAuthorization, wallet])

  React.useEffect(() => {
    if (accountAuthTask.status === 'failure') {
      onCreateAccountAuthorization(wallet)
    }
  }, [onCreateAccountAuthorization, accountAuthTask, wallet])

  return (
    () => {
      if (accountAuthTask.status === 'failure') {
        switch (addAccountAuthTask.status) {
          case 'pending':
          case 'loading':
            return (
              <div className={classes.accountAuth}>
                <h2 className={classes.accountAuthTitle}>Create accounts for new tokens</h2>
                <p className={classes.accountAuthText}>Confirm with your signature that Hermez will automatically create accounts for your new tokens.</p>
                <Spinner />
              </div>
            )
          default:
            return <></>
        }
      } else if (accountAuthTask.status === 'successful') {
        return <></>
      } else {
        return <Spinner />
      }
    }
  )
}

export default CreateAccountAuth
