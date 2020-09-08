import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import QRCode from 'qrcode.react'

import useSettingsStyles from './settings.styles'
import TokenList from './components/token-list/token-list.view'
import { changePreferredCurrency } from '../../store/settings/settings.thunks'
import withAuthGuard from '../shared/with-auth-guard/with-auth-guard.view'

function Settings ({
  metaMaskWalletTask,
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
    <div className={classes.settingsWrapper}>
      <h4 className={classes.title}>Settings</h4>
      <div className={classes.ethereumAddress}>
        {
          metaMaskWalletTask.status === 'successful'
            ? metaMaskWalletTask.data.ethereumAddress
            : '-'
        }
      </div>
      <section>
        <div>
          <TokenList
            tokens={tokensTask.status === 'successful' ? tokensTask.data : []}
            onTokenSelection={handleTokenSelection}
            seletedTokenId={preferredCurrency}
          />
        </div>
      </section>
      <div>
        {
          metaMaskWalletTask.status === 'successful'
            ? (
              <QRCode
                value={metaMaskWalletTask.data.ethereumAddress}
                className={classes.qrCode}
                size={256}
              />
            )
            : <></>
        }
      </div>
    </div>
  )
}

Settings.propTypes = {
  tokensTask: PropTypes.shape({
    status: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        tokenId: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        symbol: PropTypes.string.isRequired
      })
    ),
    error: PropTypes.string
  }),
  onChangeDefaultCurrency: PropTypes.func
}

const mapStateToProps = (state) => ({
  metaMaskWalletTask: state.account.metaMaskWalletTask,
  tokensTask: state.global.tokensTask,
  preferredCurrency: state.settings.preferredCurrency
})

const mapDispatchToProps = (dispatch) => ({
  onChangeDefaultCurrency: (selectedTokenId) => dispatch(changePreferredCurrency(selectedTokenId))
})

export default withAuthGuard(connect(mapStateToProps, mapDispatchToProps)(Settings))
