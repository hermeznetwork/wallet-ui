import React from 'react'
import Portal from '../portal/portal.view'

import useSidenavStyles from './sidenav.styles'
import { ReactComponent as AngleDownIcon } from '../../../images/icons/angle-down.svg'

export const SidenavType = {
  WithdrawInfo: 'WithdrawInfo'
}

function Sidenav ({ children, onClose }) {
  const classes = useSidenavStyles()
  const sidenavContentRef = React.useRef()

  React.useEffect(() => {
    sidenavContentRef.current.focus()
  }, [])

  function handleKeyDown (event) {
    if (event.key === 'Escape') {
      onClose()
    }
  }

  return (
    <Portal>
      <div className={classes.root}>
        <div ref={sidenavContentRef} className={classes.content} tabIndex={0} onKeyDown={handleKeyDown}>
          <button className={classes.hideButton} onClick={onClose}>
            Hide
            <AngleDownIcon className={classes.hideButtonIcon} />
          </button>
          {children}
        </div>
      </div>
    </Portal>
  )
}

export default Sidenav
