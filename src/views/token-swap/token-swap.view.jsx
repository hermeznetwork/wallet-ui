import { push } from 'connected-react-router'
import React from 'react'
import { connect } from 'react-redux'

import useTokenSwapStyles from './token-swap.styles'
import * as globalActions from '../../store/global/global.actions'
import * as tokenSwapActions from '../../store/token-swap/token-swap.actions'
import Container from '../shared/container/container.view'
import { STEP_NAME } from '../../store/token-swap/token-swap.reducer'
import Quotes from './components/quotes/quotes.view'
import SwapForm from './components/swap-form/swap-form.view'
import OfferSidenav from './components/offer-sidenav/offer-sidenav.view'

function TokenSwap ({
  currentStep,
  steps,
  onChangeHeader,
  onCleanup,
  onGoToQuotes,
  onOpenOfferInfo
}) {
  const classes = useTokenSwapStyles()
  const [isOfferSidenavOpen, setIsOfferSidenavOpen] = React.useState()

  React.useEffect(() => {
    onChangeHeader(currentStep)
  }, [currentStep])

  React.useEffect(() => onCleanup, [onCleanup])

  function handleOpenOfferSidenav () {
    setIsOfferSidenavOpen(true)
  }

  function handleCloseOfferSidenav () {
    setIsOfferSidenavOpen(false)
  }

  return (
    <div className={classes.root}>
      <Container addHeaderPadding disableTopGutter>
        {(() => {
          switch (currentStep) {
            case STEP_NAME.SWAP: {
              return <SwapForm onGoToQuotes={onGoToQuotes} onOpenOfferSidenav={handleOpenOfferSidenav} />
            }
            case STEP_NAME.QUOTES: {
              return <Quotes onOpenOfferSidenav={handleOpenOfferSidenav} />
            }
          }
        })()}
      </Container>
      {isOfferSidenavOpen && <OfferSidenav onClose={handleCloseOfferSidenav} />}
    </div>
  )
}

const getHeader = (currentStep) => {
  switch (currentStep) {
    case STEP_NAME.SWAP: {
      return {
        type: 'page',
        data: {
          title: 'Swap',
          closeAction: push('/')
        }
      }
    }
    case STEP_NAME.QUOTES: {
      return {
        type: 'page',
        data: {
          title: 'Quotes',
          goBackAction: tokenSwapActions.goToSwap()
        }
      }
    }
  }
}

const mapStateToProps = (state) => ({
  currentStep: state.tokenSwap.currentStep,
  steps: state.tokenSwap.steps
})

const mapDispatchToProps = (dispatch) => ({
  onChangeHeader: (currentStep) => dispatch(globalActions.changeHeader(getHeader(currentStep))),
  onGoToQuotes: () => dispatch(tokenSwapActions.goToQuotes()),
  onCleanup: () => dispatch(tokenSwapActions.resetState())
})

export default connect(mapStateToProps, mapDispatchToProps)(TokenSwap)
