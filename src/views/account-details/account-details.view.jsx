import React from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'

import useAccountListStyles from '../home/components/account-list/account-list.styles'
import { fetchAccount, fetchTransactions } from '../../store/account-details/account-details.thunks'
import Spinner from '../shared/spinner/spinner.view'
import RecentTransactionList from '../home/components/recent-transaction-list/recent-transaction-list.view'

function AccountDetails ({
  ethereumAddress,
  preferredCurrency,
  accountTask,
  transactionsTask,
  tokensTask,
  onLoadAccount,
  onLoadTransactions
}) {
  const classes = useAccountListStyles()
  const { tokenId } = useParams()

  React.useEffect(() => {
    onLoadAccount(ethereumAddress, tokenId)
    onLoadTransactions(ethereumAddress, tokenId)
  }, [ethereumAddress, tokenId, onLoadAccount, onLoadTransactions])

  function getTokenName (tokens, tokenId) {
    const tokenData = tokens.find(token => token.TokenID === tokenId)

    return tokenData?.Name
  }

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
                    switch (accountTask.status) {
                      case 'loading': {
                        return <Spinner />
                      }
                      case 'failed': {
                        return <p>{accountTask.error}</p>
                      }
                      case 'successful': {
                        return (
                          <div>
                            <h3>{getTokenName(tokensTask.data, accountTask.data.TokenID)}</h3>
                            <h1>{accountTask.data.Balance}</h1>
                            <p>- {preferredCurrency}</p>
                          </div>
                        )
                      }
                      default: {
                        return <></>
                      }
                    }
                  })()}
                </section>
                <section>
                  <h4 className={classes.title}>Activity</h4>
                  {(() => {
                    switch (transactionsTask.status) {
                      case 'loading': {
                        return <Spinner />
                      }
                      case 'failed': {
                        return <p>{transactionsTask.error}</p>
                      }
                      case 'successful': {
                        return (
                          <RecentTransactionList
                            transactions={transactionsTask.data}
                            tokens={tokensTask.data}
                          />
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
}

AccountDetails.propTypes = {
  ethereumAddress: PropTypes.string.isRequired,
  preferredCurrency: PropTypes.string.isRequired,
  accountTask: PropTypes.shape({
    status: PropTypes.string.isRequired,
    data: PropTypes.shape({
      Balance: PropTypes.number.isRequired,
      TokenID: PropTypes.number.isRequired
    }),
    error: PropTypes.string
  }),
  transactionsTask: PropTypes.shape({
    status: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        ID: PropTypes.string.isRequired,
        Type: PropTypes.string.isRequired,
        Amount: PropTypes.number.isRequired,
        TokenID: PropTypes.number.isRequired
      })
    ),
    error: PropTypes.string
  }),
  tokensTask: PropTypes.shape({
    status: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        TokenID: PropTypes.number.isRequired,
        Name: PropTypes.string.isRequired,
        Symbol: PropTypes.string.isRequired
      })
    )
  }),
  onLoadAccount: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  ethereumAddress: state.settings.ethereumAddress,
  preferredCurrency: state.settings.preferredCurrency,
  accountTask: state.accountDetails.accountTask,
  transactionsTask: state.accountDetails.transactionsTask,
  tokensTask: state.global.tokensTask
})

const mapDispatchToProps = (dispatch) => ({
  onLoadAccount: (ethereumAddress, tokenId) => dispatch(fetchAccount(ethereumAddress, tokenId)),
  onLoadTransactions: (ethereumAddress, tokenId) => dispatch(fetchTransactions(ethereumAddress, tokenId))
})

export default connect(mapStateToProps, mapDispatchToProps)(AccountDetails)
