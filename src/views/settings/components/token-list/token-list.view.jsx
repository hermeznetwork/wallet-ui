import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import Token from '../token/token.view'
import useTokenListStyles from './token-list.styles'

function TokenList ({ tokens, handleTokenSelection }) {
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
            tokenId={token.TokenID}
            tokenSymbol={getToken(token.TokenID).Symbol}
            tokenName={getToken(token.TokenID).Name}
            handleTokenSelection={handleTokenSelection}
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
  ),
  handleTokenSelection: PropTypes.func.isRequired
}

export default TokenList
