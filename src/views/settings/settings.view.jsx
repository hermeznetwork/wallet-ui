import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import QRCode from 'qrcode.react'

import TokenList from './components/token-list/token-list.view'
import Spinner from '../shared/spinner/spinner.view'
import useSettingsStyles from './settings.styles'

// Za default currency:
// prvo ti treba lista svih koina i da ih prikazes na strani
// onda treba da moze da se selektuje jedna (samo jedna)
// i ta jedna da se sacuva u localStorrage

// Za copy eth address:
// copy to clipboard (samo to?)

// Za disconnect wallet
// da se uradi refresh stranice

// Za force exit
// funkcionalnost nedustupna

function Settings ({
  ethereumAddress,
  preferredCurrency,
  tokensTask
}) {
  const classes = useSettingsStyles()

  return (
    <div>
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
                            <h4 className={classes.title}>Settings</h4>
                            <div className={classes.ethereumAddress}>
                              {ethereumAddress}
                            </div>

                            <TokenList
                              tokens={tokensTask.data}
                              preferredCurrency={preferredCurrency}
                            />

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
    </div>
  )

  // return (
  //   <section>
  //     <h4 className={classes.title}>Settings</h4>
  //     <div className={classes.ethereumAddress}>
  //       {ethereumAddress}
  //     </div>

  //     <TokenList
  //       tokens={tokensTask.data}
  //       preferredCurrency={preferredCurrency}
  //     />

  //     <div className={classes.preferredCurrency}>
  //       Preferred: {preferredCurrency}
  //     </div>
  //     <div>
  //       <QRCode
  //         value={ethereumAddress}
  //         className={classes.qrCode}
  //         size={256}// Adding a random number until we have designs.
  //       />
  //     </div>

  //   </section>
  // )
}

Settings.propTypes = {
  ethereumAddress: PropTypes.string.isRequired,
  preferredCurrency: PropTypes.string.isRequired,
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
  })
}

const mapStateToProps = (state) => ({
  ethereumAddress: state.settings.ethereumAddress,
  preferredCurrency: state.settings.preferredCurrency,
  tokensTask: state.global.tokensTask
})

export default connect(mapStateToProps)(Settings)
