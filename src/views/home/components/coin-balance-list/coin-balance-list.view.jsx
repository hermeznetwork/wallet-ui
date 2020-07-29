import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import CoinBalance from '../coin-balance/coin-balance.view'
import useCoinBalanceListStyles from './coin-balance-list.styles'

function CoinBalanceList ({ coinsBalance, preferredCurrency }) {
  const classes = useCoinBalanceListStyles()

  return (
    <div>
      {coinsBalance.map((coinBalance, index) =>
        <div
          key={coinBalance.coin.id}
          className={clsx({ [classes.coinBalance]: index > 0 })}
        >
          <CoinBalance
            amount={coinBalance.amount}
            currency={coinBalance.coin.abbreviation}
            preferredCurrency={preferredCurrency}
          />
        </div>
      )}
    </div>
  )
}

CoinBalanceList.propTypes = {
  coinsBalance: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      coin: PropTypes.shape({
        id: PropTypes.number.isRequired,
        abbreviation: PropTypes.string.isRequired
      })
    })
  ),
  preferredCurrency: PropTypes.string.isRequired
}

export default CoinBalanceList
