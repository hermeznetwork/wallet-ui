import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import Container from '../container/container.view'
import usePageHeaderStyles from './page-header.styles'
import { ReactComponent as ArrowBackIcon } from '../../../images/icons/arrow-back.svg'
import { ReactComponent as CloseIcon } from '../../../images/icons/close.svg'

function PageHeader ({
  title,
  subtitle,
  goBackAction,
  closeAction,
  onGoBack,
  onClose
}) {
  const classes = usePageHeaderStyles({ hasSubtitle: subtitle !== undefined })

  return (
    <header className={classes.root}>
      <Container disableVerticalGutters>
        <div className={classes.headerWrapper}>
          <div className={classes.titleWrapper}>
            {goBackAction && (
              <button
                className={clsx({
                  [classes.buttonBase]: true,
                  [classes.goBackButton]: true
                })}
                onClick={() => onGoBack(goBackAction)}
              >
                <ArrowBackIcon />
              </button>
            )}
            <h1 className={classes.title}>{title || ''}</h1>
            {closeAction && (
              <button
                className={clsx({
                  [classes.buttonBase]: true,
                  [classes.closeButton]: true
                })}
                onClick={() => onClose(closeAction)}
              >
                <CloseIcon />
              </button>
            )}
          </div>
          {subtitle && <h4 className={classes.subtitle}>{subtitle}</h4>}
        </div>
      </Container>
    </header>
  )
}

PageHeader.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  goBackAction: PropTypes.object,
  closeAction: PropTypes.object,
  onGoBack: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
}

export default PageHeader
