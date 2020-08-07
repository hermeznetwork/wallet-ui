import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import Token from '../token/token.view'
import useTokenListStyles from './token-list.styles'

function TokenList ({ tokens, preferredCurrency }) {
  const classes = useTokenListStyles()

  function getToken (tokenId) {
    return tokens.find((token) => token.TokenID === tokenId)
  }

  return (
    <div>
      {tokens.map((token, index) =>
        <div
          key={token.TokenID}
          className={clsx({ [classes.token]: index > 0 })}
        >
          <Token
            tokenSymbol={getToken(token.TokenID).Symbol}
            tokenName={getToken(token.TokenID).Name}
          />
        </div>
      )}
    </div>
  )
}

TokenList.propTypes = {
  tokens: PropTypes.arrayOf(
    PropTypes.shape({
      TokenID: PropTypes.number.isRequired,
      Name: PropTypes.string.isRequired,
      Symbol: PropTypes.string.isRequired
    })
  )
}

export default TokenList
