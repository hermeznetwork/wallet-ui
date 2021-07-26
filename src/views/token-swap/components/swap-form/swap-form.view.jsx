import React from 'react'
import PropTypes from 'prop-types'
import { BigNumber } from 'ethers'
import { useLocation } from 'react-router-dom'

import useSwapFormStyles from './swap-form.style'
import { ReactComponent as ArrowDown } from '../../../../images/icons/arrow-down-circle.svg'
import BoxAmount from '../amount-box/amount-box.view'

function SwapForm ({
  onGoToQuotes,
  onOpenOfferSidenav,
  accounts,
  preferredCurrency,
  fiatExchangeRates
}) {
  const classes = useSwapFormStyles()

  const { search } = useLocation()
  const urlSearchParams = new URLSearchParams(search)
  const fromQuery = urlSearchParams.get('from')
  const toQuery = urlSearchParams.get('to')
  const [amount, setAmount] = React.useState(BigNumber.from(0))
  const [tokensSelected, setTokens] = React.useState({})
  const setTokenPosition = tokenPosition => {
    setTokens({ ...tokensSelected, ...tokenPosition })
  }
  React.useEffect(() => {
    const from = accounts.find(a => a.accountIndex === fromQuery)
    const to = accounts.find(a => a.accountIndex === toQuery)
    setTokens({
      from,
      to
    })
  }, [accounts])
  const switchTokens = () => {
    setTokens({
      from: tokensSelected.to,
      to: tokensSelected.from
    })
  }
  const renderBox = p => {
    return (
      <BoxAmount
        account={tokensSelected[p]}
        transactionType='Transfer' // TODO we need to check this with the new api
        fiatExchangeRates={fiatExchangeRates}
        preferredCurrency={preferredCurrency}
        l2Fee={0}
        onChange={setAmount}
        position={p}
        accounts={accounts}
        setToken={setTokenPosition}
        amount={amount}
      />
    )
  }
  return (
    <div className={classes.root}>
      {renderBox('from')}
      <div className={classes.circleBox}>
        <div className={classes.circle} onClick={switchTokens}>
          <ArrowDown />
        </div>
      </div>
      {renderBox('to')}
      <div>
        <button onClick={onGoToQuotes}>Go to quotes</button>
        <button onClick={onOpenOfferSidenav}>Open offer sidenav</button>
      </div>
    </div>
  )
}

SwapForm.propTypes = {
  preferredCurrency: PropTypes.string.isRequired,
  fiatExchangeRatesTask: PropTypes.object,
  onGoToQuotes: PropTypes.func,
  onOpenOfferSidenav: PropTypes.func,
  accounts: PropTypes.object
}

export default SwapForm
