import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import Container from '../container/container.view'
import usePageHeaderStyles from './page-header.styles'
import { ReactComponent as ArrowBackIcon } from '../../../images/icons/arrow-back.svg'
import { ReactComponent as CloseIcon } from '../../../images/icons/close.svg'

function PageHeader ({
  title,
  subTitle,
  goBackAction,
  closeAction,
  onGoBack,
  onClose
}) {
  const classes = usePageHeaderStyles()

  return (
    <header className={classes.root}>
      <Container disableVerticalGutters>
        <div className={classes.headerContent}>
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
          <div className={classes.titleWrapper}>
            <h1 className={classes.title}>{title || ''}</h1>
            <h4 className={classes.subTitle}>{subTitle || ''}</h4>
          </div>
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
      </Container>
    </header>
  )
}

PageHeader.propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string,
  goBackAction: PropTypes.object,
  closeAction: PropTypes.object,
  onGoBack: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
}

export default PageHeader
