import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import useLayoutStyles from './layout.styles'
import MainHeader from '../main-header/main-header.view'
import Main from '../main/main.view'
import PageHeader from '../page-header/page-header.view'

function Layout ({ header, children }) {
  const classes = useLayoutStyles()

  return (
    <div className={classes.root}>
      {
        header.type === 'main'
          ? <MainHeader />
          : (
            <PageHeader
              title={header.data.title}
              goBackRoute={header.data.previousRoute}
            />
          )
      }
      <Main>
        {children}
      </Main>
    </div>
  )
}

Layout.propTypes = {
  header: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  header: state.global.header
})

export default connect(mapStateToProps)(Layout)
