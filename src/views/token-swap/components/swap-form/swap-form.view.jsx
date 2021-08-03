import React from 'react'
import PropTypes from 'prop-types'
import { BigNumber } from 'ethers'
import { useLocation } from 'react-router-dom'

import useSwapFormStyles from './swap-form.style'
import {
  ReactComponent as ArrowDown
} from '../../../../images/icons/arrow-down-circle.svg'
import AmountBox, { AmountBoxPosition } from '../amount-box/amount-box.view'
import SelectedButton from '../selected-quote/selected-quote.view'
import SwapButton from '../swap-button/swap-button.view'
import {
  getFixedTokenAmount
} from '../../../../utils/currencies'

function SwapForm ({
  accounts,
  quotes,
  preferredCurrency,
  fiatExchangeRates,
  amountFrom,
  amountTo,
  selectedTokens,
  selectedLpId,
  onAmountFromChange,
  onAmountToChange,
  onSelectedTokensChange,
  onGoToQuotes,
  onOpenOfferSidenav,
  onLoadAccounts,
  onLoadQuotes,
  onLoadingQuotes
}) {
  const classes = useSwapFormStyles()
  const { search } = useLocation()
  const delayQuotes = 1000
  const urlSearchParams = new URLSearchParams(search)
  const fromQuery = urlSearchParams.get(AmountBoxPosition.FROM)
  const toQuery = urlSearchParams.get(AmountBoxPosition.TO)
  const amountPositions = {
    [AmountBoxPosition.FROM]: { amount: amountFrom },
    [AmountBoxPosition.TO]: { amount: amountTo }
  }

  const [activeDropdown, setActiveDropdown] = React.useState(undefined)
  const [defaultValues, setDefaultValues] = React.useState(amountPositions)
  const [positionUpdated, handlePositionUpdated] = React.useState(undefined)
  const [timer, setTimer] = React.useState(0)

  const setTokenPosition = tokenPosition => {
    onSelectedTokensChange({ ...selectedTokens, ...tokenPosition })
  }

  React.useEffect(() => {
    if (accounts.status === 'pending') {
      onLoadAccounts(undefined)
    }
  }, [accounts])

  React.useEffect(() => {
    const from = accounts.data?.accounts.find(a => a.accountIndex === fromQuery)
    const to = accounts.data?.accounts.find(a => a.accountIndex === toQuery)
    if (from && to) {
      onSelectedTokensChange({
        [AmountBoxPosition.FROM]: from,
        [AmountBoxPosition.TO]: to
      })
    }
  }, [accounts])

  React.useEffect(() => {
    if (quotes.data) {
      const from = BigNumber.from(quotes.data[0].amountFromToken)
      const to = BigNumber.from(quotes.data[0].amountToToken)
      onAmountFromChange(from)
      onAmountToChange(to)
      if (positionUpdated === AmountBoxPosition.TO) {
        setDefaultValues({
          ...defaultValues,
          [AmountBoxPosition.FROM]: { amount: from }
        })
      } else {
        setDefaultValues({
          ...defaultValues,
          [AmountBoxPosition.TO]: { amount: to }
        })
      }
    }
  }, [quotes])

  const handleAmountChange = (value, position) => {
    clearTimeout(timer)
    if (
      selectedTokens.from &&
      selectedTokens.to &&
      positionUpdated === position
    ) {
      onLoadingQuotes()
      let data = {
        fromToken: '0x0000000000000000000000000000000000000000',
        // TODO Change to address coming in account, now it's forced to address in goerli
        toToken: '0x55a1db90a5753e6ff50fd018d7e648d58a081486',
        fromHezAddr: 'hez:ETH:3000'
      }
      if (position === AmountBoxPosition.TO) {
        data = { ...data, amountToToken: value.amount.tokens.toString() }
      } else {
        data = { ...data, amountFromToken: value.amount.tokens.toString() }
      }
      const tempTimer = setTimeout(() => onLoadQuotes(data), delayQuotes)
      setTimer(tempTimer)
    }
  }

  const hadleTokensSwitch = () => {
    if (amountFrom && amountTo) {
      handlePositionUpdated(AmountBoxPosition.FROM)
      onAmountFromChange(amountTo)
      onAmountToChange(amountFrom)
      setDefaultValues({
        [AmountBoxPosition.FROM]: { amount: amountTo },
        [AmountBoxPosition.TO]: { amount: amountFrom }
      })
    }
    onSelectedTokensChange({
      [AmountBoxPosition.FROM]: selectedTokens.to,
      [AmountBoxPosition.TO]: selectedTokens.from
    })
  }

  const renderBox = position => {
    const { amount } = defaultValues[position]
    const value = getFixedTokenAmount(
      amount,
      selectedTokens[position]?.token.decimals
    )
    return (
      <AmountBox
        account={selectedTokens[position]}
        transactionType='Transfer' // TODO we need to check this with the new api
        fiatExchangeRates={fiatExchangeRates}
        preferredCurrency={preferredCurrency}
        l2Fee={0}
        onChange={value => handleAmountChange(value, position)}
        position={position}
        accounts={accounts.data?.accounts}
        onTokenChange={setTokenPosition}
        onActiveDropdownChange={setActiveDropdown}
        isDropdownActive={activeDropdown === position}
        onPositionUpdated={handlePositionUpdated}
        defaultValue={value}
      />
    )
  }

  return (
    <div className={classes.root}>
      {renderBox(AmountBoxPosition.FROM)}
      <div className={classes.circleBox}>
        <div className={classes.circle} onClick={hadleTokensSwitch}>
          <ArrowDown />
        </div>
      </div>
      {renderBox(AmountBoxPosition.TO)}
      <SelectedButton
        quotes={quotes}
        preferredCurrency={preferredCurrency}
        fiatExchangeRates={fiatExchangeRates}
        selectedTokens={selectedTokens}
        onGoToQuotes={onGoToQuotes}
        onOpenOfferSidenav={onOpenOfferSidenav}
        selectedLpId={selectedLpId}
      />
      <SwapButton
        quotes={quotes}
      />
    </div>
  )
}

SwapForm.propTypes = {
  accounts: PropTypes.object,
  quotes: PropTypes.object,
  preferredCurrency: PropTypes.string,
  fiatExchangeRatesTask: PropTypes.object,
  amountFrom: PropTypes.object,
  amountTo: PropTypes.object,
  selectedTokens: PropTypes.object,
  selectedLpId: PropTypes.string,
  onAmountFromChange: PropTypes.func,
  onAmountToChange: PropTypes.func,
  onSelectedTokensChange: PropTypes.func,
  onGoToQuotes: PropTypes.func,
  onOpenOfferSidenav: PropTypes.func,
  onLoadAccounts: PropTypes.func,
  onLoadQuotes: PropTypes.func,
  onLoadingQuotes: PropTypes.func
}

export default SwapForm
