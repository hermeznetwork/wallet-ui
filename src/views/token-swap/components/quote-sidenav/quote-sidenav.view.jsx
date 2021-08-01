import React from 'react'

import useQuoteSidenavStyles from './quote-sidenav.styles'
import Sidenav from '../../../shared/sidenav/sidenav.view'
import { ReactComponent as SushiLogo } from '../../../../images/exchange-logos/sushi.svg'

function QuoteSidenav ({ quote, onClose }) {
  const classes = useQuoteSidenavStyles()

  return (
    <Sidenav onClose={onClose}>
      <div className={classes.root}>
        <SushiLogo className={classes.lpLogo} />
        <a className={classes.lpUrl} href={quote.lpInfo.url} target='_blank' rel='noopener noreferrer'>
          {quote.lpInfo.url}
        </a>
        <p className={classes.lpDescription}>{quote.lpInfo.description}</p>
      </div>
    </Sidenav>
  )
}

export default QuoteSidenav
