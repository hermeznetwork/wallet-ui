import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'

import { fetchMetaMaskTokens } from '../../store/transaction/transaction.thunks'
import withAuthGuard from '../shared/with-auth-guard/with-auth-guard.view'
import TransactionLayout from './components/transaction-layout/transaction-layout.view'

function Transaction ({
  metaMaskTokensTask,
  preferredCurrency,
  fiatExchangeRatesTask,
  transactionType,
  onLoadMetaMaskTokens
}) {
  const { tokenId } = useParams()
  const [selectedTokenId] = useState(tokenId)

  React.useEffect(() => {
    onLoadMetaMaskTokens()
  }, [onLoadMetaMaskTokens])

  return (
    <TransactionLayout
      tokensTask={metaMaskTokensTask}
      selectedTokenId={selectedTokenId}
      preferredCurrency={preferredCurrency}
      fiatExchangeRates={fiatExchangeRatesTask.status === 'successful' ? fiatExchangeRatesTask.data : {}}
      type={transactionType}
    />
  )
}

Transaction.propTypes = {
  metaMaskTokensTask: PropTypes.shape({
    status: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        balance: PropTypes.number.isRequired,
        token: PropTypes.shape({
          tokenId: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
          symbol: PropTypes.string.isRequired,
          decimals: PropTypes.number.isRequired,
          ethAddr: PropTypes.string.isRequired,
          ethBlockNum: PropTypes.number.isRequired
        })
      })
    )
  }),
  preferredCurrency: PropTypes.string.isRequired,
  transactionType: PropTypes.string.isRequired
}

const mapStateToProps = (state) => ({
  metaMaskTokensTask: state.transaction.metaMaskTokensTask,
  preferredCurrency: state.settings.preferredCurrency,
  fiatExchangeRatesTask: state.global.fiatExchangeRatesTask
})

const mapDispatchToProps = (dispatch) => ({
  onLoadMetaMaskTokens: () => dispatch(fetchMetaMaskTokens())
})

export default withAuthGuard(connect(mapStateToProps, mapDispatchToProps)(Transaction))
