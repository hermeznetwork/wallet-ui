import React, { useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { Redirect } from 'react-router-dom'
import { getAccountIndex } from 'hermezjs/src/addresses'

import useExitStyles from './exit.styles'
import { CurrencySymbol } from '../../../utils/currencies'
import infoIcon from '../../../images/icons/info.svg'

const STEPS = {
  first: 1,
  second: 2,
  third: 3
}

function Exit ({
  amount,
  token,
  fiatAmount,
  preferredCurrency,
  merkleProof,
  batchNum,
  accountIndex,
  pendingWithdraws
}) {
  const classes = useExitStyles()
  const [isWithdrawClicked, setIsWithdrawClicked] = useState(false)

  function getStep () {
    if (!merkleProof) {
      return STEPS.first
    } else if (!pendingWithdraws || (pendingWithdraws && !pendingWithdraws.includes(accountIndex + merkleProof.Root))) {
      return STEPS.second
    } else {
      return STEPS.third
    }
  }

  function getTag () {
    switch (getStep()) {
      case STEPS.first:
        return 'Initiated'
      case STEPS.second:
        return 'On hold'
      case STEPS.third:
        return 'Pending'
      default:
        return ''
    }
  }

  function onWithdrawClick () {
    setIsWithdrawClicked(true)
  }

  function renderRedirect () {
    return <Redirect to={`/withdraw-complete?tokenId=${getAccountIndex(accountIndex)}&batchNum=${batchNum}&accountIndex=${accountIndex}`} />
  }

  if (isWithdrawClicked) {
    return renderRedirect()
  }

  return (
    <div className={classes.root}>
      <p className={classes.step}>Step {getStep()}/3</p>
      <div className={classes.rowTop}>
        <span className={classes.txType}>Withdrawal</span>
        <span className={classes.amountFiat}>{CurrencySymbol[preferredCurrency].symbol}{fiatAmount.toFixed(2)}</span>
      </div>
      <div className={classes.rowBottom}>
        <div className={clsx({
          [classes.stepTagWrapper]: true,
          [classes.stepTagWrapperTwo]: getStep() === STEPS.second
        })}
        >
          <span className={clsx({
            [classes.stepTag]: true,
            [classes.stepTagTwo]: getStep() === STEPS.second
          })}
          >{getTag()}
          </span>
        </div>
        <span className={classes.tokenAmount}>{amount} {token.symbol}</span>
      </div>
      {getStep() === STEPS.second &&
        <div className={classes.withdraw}>
          <div className={classes.withdrawInfo}>
            <img src={infoIcon} alt='Info Icon' className={classes.infoIcon} />
            <span className={classes.infoText}>Sign required to finalize withdraw.</span>
          </div>
          <button className={classes.withdrawButton} onClick={onWithdrawClick}>Finalise</button>
        </div>}
    </div>
  )
}

Exit.propTypes = {
  amount: PropTypes.string.isRequired,
  token: PropTypes.object.isRequired,
  fiatAmount: PropTypes.number.isRequired,
  preferredCurrency: PropTypes.string.isRequired,
  merkleProof: PropTypes.object,
  batchNum: PropTypes.number,
  accountIndex: PropTypes.string,
  pendingWithdraws: PropTypes.array.isRequired
}

export default Exit
