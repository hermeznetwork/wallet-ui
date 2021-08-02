import React from 'react'
import PropTypes from 'prop-types'
import { BigNumber } from 'ethers'
import { useLocation } from 'react-router-dom'

import useSwapFormStyles from './swap-form.style'
import {
  ReactComponent as ArrowDown
} from '../../../../images/icons/arrow-down-circle.svg'
import AmountBox, { AmountBoxPosition } from '../amount-box/amount-box.view'
import Offers from '../offers/offers.view'
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
  setAmountFrom,
  setAmountTo,
  setSelectedTokens,
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
    [AmountBoxPosition.FROM]: { amount: amountFrom, setAmount: setAmountFrom },
    [AmountBoxPosition.TO]: { amount: amountTo, setAmount: setAmountTo }
  }
  const defaultValues = {
    [AmountBoxPosition.FROM]: BigNumber.from(0).toString(),
    [AmountBoxPosition.TO]: BigNumber.from(0).toString()
  }

  const [valuesToUpdate, setValuesToUpdate] = React.useState(defaultValues)
  const [positionUpdated, setPositionUpdated] = React.useState(undefined)
  const [activeDropdown, setActiveDropdown] = React.useState(undefined)

  const setTokenPosition = tokenPosition => {
    setSelectedTokens({ ...selectedTokens, ...tokenPosition })
  }

  React.useEffect(() => {
    if (accounts.status === 'pending') {
      onLoadAccounts(undefined)
    }
  }, [accounts])

  React.useEffect(() => {
    const from = accounts?.data.accounts.find(a => a.accountIndex === fromQuery)
    const to = accounts?.data.accounts.find(a => a.accountIndex === toQuery)
    if (from && to) {
      setSelectedTokens({
        [AmountBoxPosition.FROM]: from,
        [AmountBoxPosition.TO]: to
      })
    }
  }, [accounts])

  React.useEffect(() => {
    let timer = 0
    if (amountFrom.amount &&
      selectedTokens.from &&
      selectedTokens.to &&
      positionUpdated === AmountBoxPosition.FROM) {
      const amountFromToken = getBigNumberToString(amountFrom)
      if (amountFromToken === '0') return

      onLoadingQuotes()
      timer = setTimeout(() => onLoadQuotes({
        fromToken: '0x0000000000000000000000000000000000000000',
        // TODO Change to address coming in account, now it's forced to address in goerli
        toToken: '0x55a1db90a5753e6ff50fd018d7e648d58a081486',
        amountFromToken: amountFromToken,
        fromHezAddr: 'hez:ETH:3000'
      }), delayQuotes)
    }
    return () => clearTimeout(timer)
  }, [selectedTokens, amountFrom])

  React.useEffect(() => {
    let timer = 0
    if (amountTo.amount &&
      selectedTokens.from &&
      selectedTokens.to &&
      positionUpdated === AmountBoxPosition.TO) {
      const amountToToken = getBigNumberToString(amountTo)
      if (amountToToken === '0') return
      onLoadingQuotes()
      timer = setTimeout(() => onLoadQuotes({
        fromToken: '0x0000000000000000000000000000000000000000',
        // TODO Change to address coming in account, now it's forced to address in goerli
        toToken: '0x55a1db90a5753e6ff50fd018d7e648d58a081486',
        amountToToken,
        fromHezAddr: 'hez:ETH:3000'
      }), delayQuotes)
    }
    return () => clearTimeout(timer)
  }, [amountTo])

  React.useEffect(() => {
    if (quotes.data.quotes) {
      if (positionUpdated) {
        const value = positionUpdated === AmountBoxPosition.FROM
          ? quotes.data.quotes[0].amountToToken
          : quotes.data.quotes[0].amountFromToken
        const positionToUpdate = positionUpdated === AmountBoxPosition.FROM
          ? AmountBoxPosition.TO
          : AmountBoxPosition.FROM
        setValuesToUpdate({
          ...valuesToUpdate,
          [positionToUpdate]: getFixedTokenAmount(
            value,
            selectedTokens[positionToUpdate].token.decimals
          )
        })
      } else {
        const amountFromToUpdate = getFixedTokenAmount(
          quotes.data.quotes[0].amountFromToken,
          selectedTokens[AmountBoxPosition.FROM].token.decimals
        )
        const amountToToUpdate = getFixedTokenAmount(
          quotes.data.quotes[0].amountToToken,
          selectedTokens[AmountBoxPosition.TO].token.decimals
        )
        setValuesToUpdate({
          [AmountBoxPosition.FROM]: amountFromToUpdate,
          [AmountBoxPosition.TO]: amountToToUpdate
        })
      }
    }
  }, [quotes])

  const getBigNumberToString = amount =>
    BigNumber.from(amount.amount.tokens._hex).toString()

  const switchTokens = () => {
    if (amountFrom && amountTo) {
      const amountFromToUpdate = getFixedTokenAmount(
        BigNumber.from(amountFrom.amount.tokens._hex).toString(),
        selectedTokens[AmountBoxPosition.FROM].token.decimals
      )
      const amountToToUpdate = getFixedTokenAmount(
        BigNumber.from(amountTo.amount.tokens._hex).toString(),
        selectedTokens[AmountBoxPosition.TO].token.decimals
      )
      setValuesToUpdate({
        [AmountBoxPosition.FROM]: amountToToUpdate,
        [AmountBoxPosition.TO]: amountFromToUpdate
      })
    }

    setSelectedTokens({
      [AmountBoxPosition.FROM]: selectedTokens.to,
      [AmountBoxPosition.TO]: selectedTokens.from
    })
  }

  const renderBox = position => {
    const { setAmount } = amountPositions[position]
    const value = valuesToUpdate[position]
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
        onActiveDropdownChange={setActiveDropdown}
        isDropdownActive={activeDropdown === position}
        positionUpdated={positionUpdated}
        setPositionUpdated={setPositionUpdated}
        defaultValue={value}
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
      <Offers
        quotes={quotes}
        preferredCurrency={preferredCurrency}
        fiatExchangeRates={fiatExchangeRates}
        selectedTokens={selectedTokens}
        onGoToQuotes={onGoToQuotes}
        onOpenOfferSidenav={onOpenOfferSidenav}
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
  setAmountFrom: PropTypes.func,
  setAmountTo: PropTypes.func,
  setSelectedTokens: PropTypes.func,
  onGoToQuotes: PropTypes.func,
  onOpenOfferSidenav: PropTypes.func,
  onLoadAccounts: PropTypes.func,
  onLoadQuotes: PropTypes.func,
  onLoadingQuotes: PropTypes.func
}

export default SwapForm
