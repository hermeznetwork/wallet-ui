import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import QRCode from 'qrcode.react'

import TokenList from './components/token-list/token-list.view'
import Spinner from '../shared/spinner/spinner.view'
import useSettingsStyles from './settings.styles'
import { changePreferredCurrency } from '../../store/settings/settings.thunks'

function Settings ({
  ethereumAddress,
  tokensTask,
  onChangeDefaultCurrency,
  preferredCurrency
}) {
  const classes = useSettingsStyles()

  function handleTokenSelection (selectedTokenId) {
    if (selectedTokenId !== preferredCurrency) {
      onChangeDefaultCurrency(selectedTokenId)
    }
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
                            <TokenList
                              tokens={tokensTask.data}
                              onTokenSelection={handleTokenSelection}
                              seletedTokenId={preferredCurrency}
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
  onChangeDefaultCurrency: (selectedTokenId) => dispatch(changePreferredCurrency(selectedTokenId))
})

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
