import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import QRCode from 'qrcode.react'

import useSettingsStyles from './settings.styles'
import CurrencyList from './components/currency-list/currency-list.view'
import { changePreferredCurrency } from '../../store/settings/settings.thunks'
import withAuthGuard from '../shared/with-auth-guard/with-auth-guard.view'
import { CurrencySymbol } from '../../utils/currencies'
import Container from '../shared/container/container.view'

function Settings ({
  metaMaskWalletTask,
  preferredCurrency,
  onChangePreferredCurrency
}) {
  const classes = useSettingsStyles()

  function handlePreferredCurrencySelection (selectedCurrency) {
    if (selectedCurrency !== preferredCurrency) {
      onChangePreferredCurrency(selectedCurrency)
    }
  }

  return (
    <Container>
      <div className={classes.root}>
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
            <CurrencyList
              currencies={Object.values(CurrencySymbol)}
              selectedCurrency={preferredCurrency}
              onSelectCurrency={handlePreferredCurrencySelection}
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
    </Container>
  )
}

Settings.propTypes = {
  onChangePreferredCurrency: PropTypes.func
}

const mapStateToProps = (state) => ({
  metaMaskWalletTask: state.account.metaMaskWalletTask,
  preferredCurrency: state.settings.preferredCurrency
})

const mapDispatchToProps = (dispatch) => ({
  onChangePreferredCurrency: (selectedTokenId) => dispatch(changePreferredCurrency(selectedTokenId))
})

export default withAuthGuard(connect(mapStateToProps, mapDispatchToProps)(Settings))
