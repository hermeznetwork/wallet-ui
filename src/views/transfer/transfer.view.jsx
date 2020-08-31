import React from 'react'

import withAuthGuard from '../shared/with-auth-guard/with-auth-guard.view'

function Transfer () {
  return <p>This is the TRANSFER component</p>
}

export default withAuthGuard(Transfer)
