import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import useHomeStyles from './account.styles'
import { fetchAccounts } from '../../store/home/home.thunks'
import QRCode from 'qrcode.react'

// I named it Settings since this is how it's called in design.
// Also it makes more sense to call it like that than account,
// which can be confusing (account usualy linked with financial vocabulary)
function Settings ({
  ethereumAddress,
  preferredCurrency,
  onLoadAccounts
}) {
  const classes = useHomeStyles()

  React.useEffect(() => {
    onLoadAccounts(ethereumAddress)
  }, [ethereumAddress, onLoadAccounts])

  return (
    <section>
      <h4 className={classes.title}>Settings</h4>
      <div className={classes.ethereumAddress}>
        {ethereumAddress}
      </div>
      <div className={classes.preferredCurrency}>
        {preferredCurrency}
      </div>
      <div className={classes.qrWrapper}>
        <QRCode
          value={ethereumAddress}
          className={classes.qrCanvas}
        />
      </div>
    </section>
  )
}

Settings.propTypes = {
  ethereumAddress: PropTypes.string.isRequired,
  preferredCurrency: PropTypes.string.isRequired
}

const mapStateToProps = (state) => ({
  ethereumAddress: state.account.ethereumAddress,
  preferredCurrency: state.account.preferredCurrency
})

const mapDispatchToProps = (dispatch) => ({
  onLoadAccounts: (ethereumAddress) => dispatch(fetchAccounts(ethereumAddress))
})

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
