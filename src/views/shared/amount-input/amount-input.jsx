import React from 'react'
import { BigNumber } from 'ethers'

import { getFixedTokenAmount, getTokenAmountInPreferredCurrency } from '../../../utils/currencies'
import { fixTransactionAmount, getMaxTxAmount, isTransactionAmountCompressedValid } from '../../../utils/transactions'
import { parseUnits } from 'ethers/lib/utils'
import { getTransactionFee } from '../../../utils/fees'
import { TxType } from '@hermeznetwork/hermezjs/src/enums'
import { getProvider } from '@hermeznetwork/hermezjs/src/providers'

const INPUT_REGEX = /^\d*(?:\.\d*)?$/

function AmountInput (Component) {
  return function (props) {
    const { transactionType, account, l2Fee, fiatExchangeRates, preferredCurrency } = props
    const [gasPrice, setGasPrice] = React.useState(BigNumber.from(0))
    const [value, setValue] = React.useState('')
    const [amount, setAmount] = React.useState({ tokens: BigNumber.from(0), fiat: 0 })
    const [showInFiat, setShowInFiat] = React.useState(false)
    const [isAmountNegative, setIsAmountNegative] = React.useState(undefined)
    const [isAmountMoreThanFunds, setIsAmountMoreThanFunds] = React.useState(undefined)
    const [isAmountCompressedInvalid, setIsAmountCompressedInvalid] = React.useState(undefined)

    React.useEffect(() => {
      getProvider().getGasPrice().then((gasPrice) => setGasPrice(gasPrice))
    }, [])

    React.useEffect(() => {
      if (props.onChange) {
        const isInvalid = (() => {
          if (isAmountNegative === undefined && isAmountMoreThanFunds === undefined && isAmountCompressedInvalid === undefined) {
            return undefined
          }

          return isAmountNegative || isAmountMoreThanFunds || isAmountCompressedInvalid
        })()

        props.onChange({
          amount,
          showInFiat,
          isInvalid
        })
      }
    }, [amount, showInFiat, isAmountMoreThanFunds, isAmountCompressedInvalid])

    function convertAmountToFiat (tokensAmount) {
      const fixedTokenAmount = getFixedTokenAmount(tokensAmount.toString(), account.token.decimals)

      return getTokenAmountInPreferredCurrency(
        fixedTokenAmount,
        account.token.USD,
        preferredCurrency,
        fiatExchangeRates
      ).toFixed(2)
    }

    function convertAmountToTokens (fiatAmount) {
      const tokensAmount = fiatAmount / account.token.USD

      return parseUnits(tokensAmount.toFixed(account.token.decimals))
    }

    function checkAmountValidity (newAmount) {
      const fee = getTransactionFee(transactionType, newAmount, account.token, l2Fee, gasPrice)
      const newAmountWithFee = newAmount.add(fee)

      setIsAmountNegative(newAmountWithFee.lte(BigNumber.from(0)))
      setIsAmountMoreThanFunds(newAmountWithFee.gt(BigNumber.from(account.balance)))

      if (transactionType !== TxType.Deposit && transactionType !== TxType.ForceExit) {
        setIsAmountCompressedInvalid(isTransactionAmountCompressedValid(newAmount) === false)
      }
    }

    function handleInputChange (event) {
      if (INPUT_REGEX.test(event.target.value)) {
        if (showInFiat) {
          const newAmountInFiat = Number(event.target.value)
          const newAmountInTokens = convertAmountToTokens(newAmountInFiat)
          const fixedAmountInTokens = fixTransactionAmount(newAmountInTokens)

          setAmount({ tokens: fixedAmountInTokens, fiat: newAmountInFiat.toFixed(2) })
          checkAmountValidity(fixedAmountInTokens)
          setValue(event.target.value)
        } else {
          try {
            const tokensValue = event.target.value.length > 0 ? event.target.value : '0'
            const newAmountInTokens = parseUnits(tokensValue, account.token.decimals)
            const newAmountInFiat = convertAmountToFiat(newAmountInTokens)

            setAmount({ tokens: newAmountInTokens, fiat: newAmountInFiat })
            checkAmountValidity(newAmountInTokens)
            setValue(event.target.value)
          } catch (err) {}
        }
      }
    }

    function handleSendAll () {
      const maxPossibleAmount = BigNumber.from(account.balance)
      const maxAmountWithoutFee = getMaxTxAmount(transactionType, maxPossibleAmount, account.token, l2Fee, gasPrice)
      const maxAmountWithoutFeeInFiat = convertAmountToFiat(maxAmountWithoutFee)

      if (showInFiat) {
        setValue(maxAmountWithoutFeeInFiat)
      } else {
        const newValue = getFixedTokenAmount(maxAmountWithoutFee, account.token.decimals)

        setValue(newValue)
      }

      setAmount({ tokens: maxAmountWithoutFee, fiat: maxAmountWithoutFeeInFiat })
      checkAmountValidity(maxAmountWithoutFee)
    }

    function handleSwapCurrency () {
      const newValue = showInFiat
        ? getFixedTokenAmount(amount.tokens, account.token.decimals)
        : amount.fiat

      if (value.length > 0) {
        setValue(newValue)
      }

      setShowInFiat(!showInFiat)
    }

    return (
      <Component
        value={value}
        amount={amount}
        showInFiat={showInFiat}
        isAmountNegative={isAmountNegative}
        isAmountMoreThanFunds={isAmountMoreThanFunds}
        isAmountCompressedInvalid={isAmountCompressedInvalid}
        onInputChange={handleInputChange}
        onSendAll={handleSendAll}
        onSwapCurrency={handleSwapCurrency}
        {...props}
      />
    )
  }
}

export default AmountInput
