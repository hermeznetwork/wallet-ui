import { push } from 'connected-react-router'
import React from 'react'
import { connect } from 'react-redux'

import useTokenSwapStyles from './token-swap.styles'
import * as globalActions from '../../store/global/global.actions'
import * as tokenSwapActions from '../../store/token-swap/token-swap.actions'
import Container from '../shared/container/container.view'

function TokenSwap ({ onChangeHeader, onCleanup }) {
  const classes = useTokenSwapStyles()

  React.useEffect(() => {
    onChangeHeader()
  }, [])

  React.useEffect(() => onCleanup, [onCleanup])

  return (
    <div className={classes.root}>
      <Container addHeaderPadding disableTopGutter>
        <p>It works</p>
      </Container>
    </div>
  )
}

const mapDispatchToProps = (dispatch) => ({
  onChangeHeader: () =>
    dispatch(
      globalActions.changeHeader({
        type: 'page',
        data: {
          title: 'Swap',
          closeAction: push('/')
        }
      })
    ),
  onCleanup: () => dispatch(tokenSwapActions.resetState())
})

export default connect(null, mapDispatchToProps)(TokenSwap)
