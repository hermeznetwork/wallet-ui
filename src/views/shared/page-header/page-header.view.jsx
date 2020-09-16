import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import Container from '../container/container.view'
import usePageHeaderStyles from './page-header.styles'
import arrowBackIcon from '../../../images/icons/header/arrow-back.svg'

function PageHeader ({ title, goBackRoute }) {
  const classes = usePageHeaderStyles()

  return (
    <header className={classes.root}>
      <Container disableVerticalGutters>
        <Link to={goBackRoute} className={classes.goBackButton}>
          <img src={arrowBackIcon} alt='Go back' className={classes.arrowBackIcon} />
        </Link>
        <div className={classes.headerContent}>
          <h1 className={classes.title}>{title}</h1>
        </div>
      </Container>
    </header>
  )
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  goBackRoute: PropTypes.string.isRequired
}

export default PageHeader
