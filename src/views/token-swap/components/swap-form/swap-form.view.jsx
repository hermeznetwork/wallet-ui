import React from 'react'
import useTokenSwapStyles from './swap-form.style'
import { BigNumber } from 'ethers'
import BoxAmount from '../amount-box/amount-box.view'
function SwapForm ({
  onGoToQuotes,
  onOpenOfferSidenav,
  accounts,
  preferredCurrency,
  fiatExchangeRates
}) {
  const classes = useTokenSwapStyles()
  console.log(accounts)

  const [amount, setAmount] = React.useState(BigNumber.from(0))
  console.log(amount)
  const renderBox = p => {
    if (accounts.length === 0) return null
    return (
      <BoxAmount
        account={accounts[p]}
        transactionType='Transfer'
        fiatExchangeRates={fiatExchangeRates}
        preferredCurrency={preferredCurrency}
        l2Fee={0}
        onChange={setAmount}
      />
    )
  }
  return (
    <div className={classes.root}>
      {renderBox(0)}
      {renderBox(1)}
      <div>
        <button onClick={onGoToQuotes}>Go to quotes</button>
        <button onClick={onOpenOfferSidenav}>Open offer sidenav</button>
      </div>
    </div>
  )
}

export default SwapForm
