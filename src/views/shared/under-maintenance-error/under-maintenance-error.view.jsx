import React from 'react'

import useUnderMaintenanceErrorStyles from './under-maintenance-error.styles'
import { ReactComponent as UnderMaintenanceIcon } from '../../../images/icons/under-maintenance.svg'
import PublicLayout from '../public-layout/public-layout.view'

function UnderMaintenanceError () {
  const classes = useUnderMaintenanceErrorStyles()

  return (
    <PublicLayout>
      <div className={classes.root}>
        <UnderMaintenanceIcon className={classes.icon} />
        <h1 className={classes.message}>
          Hermez is currently under maintenance. Please, try to access it again later.
        </h1>
      </div>
    </PublicLayout>
  )
}

export default UnderMaintenanceError
