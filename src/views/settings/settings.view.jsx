import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import QRCode from 'qrcode.react'

import useSettingsStyles from './settings.styles'

function Settings ({
  ethereumAddress,
  preferredCurrency,
  tokenList
}) {
  const classes = useSettingsStyles()

  return (
    <section>
      <h4 className={classes.title}>Settings</h4>
      <div className={classes.ethereumAddress}>
        {ethereumAddress}
      </div>

      <div>
        {tokenList}
      </div>

      <div className={classes.preferredCurrency}>
        {preferredCurrency}
      </div>
      <div>
        <QRCode
          value={ethereumAddress}
          className={classes.qrCode}
          size={256}// Adding a random number until we have designs.
        />
      </div>
    </section>
  )
}

Settings.propTypes = {
  ethereumAddress: PropTypes.string.isRequired,
  preferredCurrency: PropTypes.string.isRequired,
  tokenList: PropTypes.array.isRequired
}

const mapStateToProps = (state) => ({
  ethereumAddress: state.settings.ethereumAddress,
  preferredCurrency: state.settings.preferredCurrency,
  tokenList: state.settings.tokenList
})

export default connect(mapStateToProps)(Settings)
