import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import useLayoutStyles from './layout.styles'
import MainHeader from '../main-header/main-header.view'
import Main from '../main/main.view'
import PageHeader from '../page-header/page-header.view'
import Snackbar from '../snackbar/snackbar.view'
import { closeSnackbar } from '../../../store/global/global.actions'

function Layout ({
  header,
  snackbar,
  children,
  onGoBack,
  onClose,
  onCloseSnackbar
}) {
  const classes = useLayoutStyles()

  return (
    <div className={classes.root}>
      {header.type === 'main' && <MainHeader />}
      {header.type === 'page' && (
        <PageHeader
          title={header.data.title}
          subtitle={header.data.subtitle}
          goBackAction={header.data.goBackAction}
          closeAction={header.data.closeAction}
          onGoBack={onGoBack}
          onClose={onClose}
        />
      )}
      <Main>
        {children}
      </Main>
      {snackbar.status === 'open' && (
        <Snackbar
          message={snackbar.message}
          backgroundColor={snackbar.backgroundColor}
          onClose={onCloseSnackbar}
        />
      )}
    </div>
  )
}

Layout.propTypes = {
  header: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  header: state.global.header,
  snackbar: state.global.snackbar
})

const mapDispatchToProps = (dispatch) => ({
  onCloseSnackbar: () => dispatch(closeSnackbar()),
  onGoBack: (action) => dispatch(action),
  onClose: (action) => dispatch(action)
})

export default connect(mapStateToProps, mapDispatchToProps)(Layout)
