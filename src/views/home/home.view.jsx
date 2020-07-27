import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import useHomeStyles from './home.styles'
import TotalBalance from './components/total-balance/total-balance.view'
import CoinBalanceList from './components/coin-balance-list/coin-balance-list.view'
import { fetchCoinsBalance } from '../../store/home/home.thunks'
import Spinner from '../shared/spinner/spinner.view'

function Home ({
  ethereumAddress,
  coinsBalanceTask,
  defaultCurrency,
  fiatCurrency,
  onLoadCoinsBalance
}) {
  const classes = useHomeStyles()

  React.useEffect(() => {
    onLoadCoinsBalance(ethereumAddress)
  }, [ethereumAddress, onLoadCoinsBalance])

  function getTotalBalance (coinsBalance) {
    return coinsBalance.reduce((amount, coinBalance) => amount + coinBalance.amount, 0)
  }

  return (
    <div>
      <section>
        <h4 className={classes.title}>Total balance</h4>
        {(() => {
          switch (coinsBalanceTask.status) {
            case 'loading': {
              return <Spinner />
            }
            case 'failed': {
              return (
                <TotalBalance
                  amount={undefined}
                  currency={defaultCurrency}
                />
              )
            }
            case 'successful': {
              return (
                <TotalBalance
                  amount={getTotalBalance(coinsBalanceTask.data)}
                  currency={defaultCurrency}
                />
              )
            }
            default: {
              return <></>
            }
          }
        })()}
        <div className={classes.actionButtonsGroup}>
          <button className={classes.actionButton}>Deposit</button>
          <button className={classes.actionButton}>Withdraw</button>
        </div>
      </section>
      <section>
        <h4 className={classes.title}>Accounts</h4>
        {(() => {
          switch (coinsBalanceTask.status) {
            case 'loading': {
              return <Spinner />
            }
            case 'failed': {
              return <p>{coinsBalanceTask.error}</p>
            }
            case 'successful': {
              return (
                <CoinBalanceList
                  coinsBalance={coinsBalanceTask.data}
                  fiatCurrency={fiatCurrency}
                />
              )
            }
            default: {
              return <></>
            }
          }
        })()}
      </section>
    </div>
  )
}

Home.propTypes = {
  ethereumAddress: PropTypes.string.isRequired,
  accounts: PropTypes.shape({
    status: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        coin: PropTypes.shape({
          id: PropTypes.number.isRequired,
          abbreviation: PropTypes.string.isRequired
        })
      })
    ),
    error: PropTypes.string
  }),
  fiatCurrency: PropTypes.string.isRequired
}

const mapStateToProps = (state) => ({
  ethereumAddress: state.account.ethereumAddress,
  coinsBalanceTask: state.home.coinsBalanceTask,
  defaultCurrency: state.account.defaultCurrency,
  fiatCurrency: state.account.preferredFiatCurrency
})

const mapDispatchToProps = (dispatch) => ({
  onLoadCoinsBalance: (ethereumAddress) => dispatch(fetchCoinsBalance(ethereumAddress))
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
