import React from 'react'
import PropTypes from 'prop-types'
import { BigNumber } from 'ethers'
import { useLocation } from 'react-router-dom'

import useSwapFormStyles from './swap-form.style'
import { ReactComponent as ArrowDown } from '../../../../images/icons/arrow-down-circle.svg'
import AmountBox, { AmountBoxPosition } from '../amount-box/amount-box.view'

function SwapForm ({
  accounts,
  preferredCurrency,
  fiatExchangeRates,
  selectedTokens,
  onGoToQuotes,
  onOpenQuoteSidenav,
  onLoadAccounts,
  onSelectedTokensChange
}) {
  const classes = useSwapFormStyles()
  const { search } = useLocation()
  const urlSearchParams = new URLSearchParams(search)
  const fromQuery = urlSearchParams.get(AmountBoxPosition.FROM)
  const toQuery = urlSearchParams.get(AmountBoxPosition.TO)

  const [amount, setAmount] = React.useState(BigNumber.from(0))
  const [activeDropdown, setActiveDropdown] = React.useState(undefined)

  const setTokenPosition = tokenPosition => {
    onSelectedTokensChange({ ...selectedTokens, ...tokenPosition })
  }

  React.useEffect(() => {
    if (accounts.status === 'pending') {
      onLoadAccounts(undefined)
    }
  }, [accounts])

  React.useEffect(() => {
    const from = accounts?.data.accounts.find(a => a.accountIndex === fromQuery)
    const to = accounts?.data.accounts.find(a => a.accountIndex === toQuery)
    onSelectedTokensChange({
      [AmountBoxPosition.FROM]: from,
      [AmountBoxPosition.TO]: to
    })
  }, [accounts])

  const switchTokens = () => {
    onSelectedTokensChange({
      [AmountBoxPosition.FROM]: selectedTokens.to,
      [AmountBoxPosition.TO]: selectedTokens.from
    })
  }

  const renderBox = position => {
    return (
      <AmountBox
        account={selectedTokens[position]}
        transactionType='Transfer' // TODO we need to check this with the new api
        fiatExchangeRates={fiatExchangeRates}
        preferredCurrency={preferredCurrency}
        l2Fee={0}
        onChange={setAmount}
        position={position}
        accounts={accounts.data.accounts}
        onTokenChange={setTokenPosition}
        amount={amount}
        onActiveDropdownChange={setActiveDropdown}
        isDropdownActive={activeDropdown === position}
      />
    )
  }

  return (
    <div className={classes.root}>
      {renderBox(AmountBoxPosition.FROM)}
      <div className={classes.circleBox}>
        <div className={classes.circle} onClick={switchTokens}>
          <ArrowDown />
        </div>
      </div>
      {renderBox(AmountBoxPosition.TO)}
      <div>
        {selectedTokens[AmountBoxPosition.TO] && (
          <button onClick={onGoToQuotes}>Go to quotes</button>
        )}
        <button onClick={onOpenQuoteSidenav}>Open offer sidenav</button>
      </div>
    </div>
  )
}

SwapForm.propTypes = {
  accounts: PropTypes.object,
  preferredCurrency: PropTypes.string,
  fiatExchangeRatesTask: PropTypes.object,
  onGoToQuotes: PropTypes.func,
  onOpenQuoteSidenav: PropTypes.func,
  onLoadAccounts: PropTypes.func
}

export default SwapForm
