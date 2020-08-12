import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import QRCode from 'qrcode.react'

import TokenList from './components/token-list/token-list.view'
import Token from './components/token/token.view'
import Spinner from '../shared/spinner/spinner.view'
import useSettingsStyles from './settings.styles'
// import { SETTINGS } from '../../constants'
import { fetchDefaultCurrency } from '../../store/settings/settings.thunks'

function Settings ({
  ethereumAddress,
  tokensTask,
  onChangeDefaultCurrency,
  preferredCurrency
}) {
  const classes = useSettingsStyles()

  // if there is no default currency stored, set to one from constants
  // if (!localStorage.getItem('defaultCurrencyId')) {
  //   localStorage.setItem('defaultCurrencyId', SETTINGS.DEFAULT_CURRENCY_ID)
  // }

  // var defaultCurrencyId = parseInt(localStorage.getItem('defaultCurrencyId'))

  // const handleTokenSelection = function (selectedTokenId) {
  //   if (selectedTokenId !== defaultCurrencyId) {
  //     // if selected is different then default, set selected as new default
  //     localStorage.setItem('defaultCurrencyId', selectedTokenId)
  //     defaultCurrencyId = selectedTokenId

  //     //call the prop
  //     //dispatch redux action
  //     //defaultCurrencyId
  //   }
  // }

  const handleTokenSelection = function (selectedTokenId) {
    if (selectedTokenId !== preferredCurrency) {
      onChangeDefaultCurrency(selectedTokenId)
    }
  }

  // ako bi onChangeDefaultCurrency mogao da zameni funkciju iza handleTokenSelection
  // onda handleTokenSelection jednako onChangeDefaultCurrency
  // i da se ostalo nastavi tako kako je
  // proba 1: ovako kako je gore i napisano

  function getToken (defaultCurrencyId) {
    return tokensTask.data.find((token) => token.TokenID === defaultCurrencyId)
  }

  return (
    <div>
      <h4 className={classes.title}>Settings</h4>
      <div className={classes.ethereumAddress}>
        {ethereumAddress}
      </div>
      {(() => {
        switch (tokensTask.status) {
          case 'loading': {
            return <Spinner />
          }
          case 'failed': {
            return <p>{tokensTask.error}</p>
          }
          case 'successful': {
            return (
              <>
                <section>
                  {(() => {
                    switch (tokensTask.status) {
                      case 'loading': {
                        return <Spinner />
                      }
                      case 'failed': {
                        return <p>{tokensTask.error}</p>
                      }
                      case 'successful': {
                        return (
                          <div>
                            <div>
                              Default currency
                              <Token
                                tokenId={preferredCurrency}
                                tokenSymbol={getToken(preferredCurrency).Symbol}
                                tokenName={getToken(preferredCurrency).Name}
                                handleTokenSelection={handleTokenSelection}
                              />
                            </div>
                            <TokenList
                              tokens={tokensTask.data}
                              handleTokenSelection={handleTokenSelection}
                              // pass active token ID removing the need to call Token
                            />
                          </div>
                        )
                      }
                      default: {
                        return <></>
                      }
                    }
                  })()}
                </section>
              </>
            )
          }
          default: {
            return <></>
          }
        }
      })()}
      <div>
        <QRCode
          value={ethereumAddress}
          className={classes.qrCode}
          size={256}// Adding a random number until we have designs.
        />
      </div>
    </div>
  )
}

Settings.propTypes = {
  ethereumAddress: PropTypes.string.isRequired,
  tokensTask: PropTypes.shape({
    status: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        TokenID: PropTypes.number.isRequired,
        Name: PropTypes.string.isRequired,
        Symbol: PropTypes.string.isRequired
      })
    ),
    error: PropTypes.string
  }),
  onChangeDefaultCurrency: PropTypes.func
}

const mapStateToProps = (state) => ({
  ethereumAddress: state.settings.ethereumAddress,
  tokensTask: state.global.tokensTask,
  preferredCurrency: state.settings.preferredCurrency
})

const mapDispatchToProps = (dispatch) => ({
  onChangeDefaultCurrency: (selectedTokenId) => dispatch(fetchDefaultCurrency(selectedTokenId))
})

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
