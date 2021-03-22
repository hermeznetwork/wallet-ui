import React from 'react'
import { connect } from 'react-redux'

import useUnderMaintenanceErrorStyles from './under-maintenance-error.styles'
import * as globalActions from '../../../../store/global/global.actions'
import { ReactComponent as UnderMaintenanceIcon } from '../../../../images/icons/under-maintenance.svg'

function UnderMaintenanceError ({ onChangeHeader }) {
  const classes = useUnderMaintenanceErrorStyles()

  return (
    <div className={classes.root}>
      <UnderMaintenanceIcon className={classes.icon} />
      <h1 className={classes.message}>
        Hermez is currently under maintenance. Please, try to access it again later.
      </h1>
    </div>
  )
}

const mapDispatchToProps = (dispatch) => ({
  onChangeHeader: () => dispatch(globalActions.changeHeader({ type: undefined }))
})

export default connect(undefined, mapDispatchToProps)(UnderMaintenanceError)
