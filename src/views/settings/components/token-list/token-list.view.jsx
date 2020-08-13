import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import Token from '../token/token.view'
import useTokenListStyles from './token-list.styles'

function TokenList ({ tokens, onTokenSelection, seletedTokenId }) {
  const classes = useTokenListStyles()

  function getToken (tokenId) {
    return tokens.find((token) => token.TokenID === tokenId)
  }

  return (
    <div>
      <div>
        <h4>Default currency</h4>
        <Token
          tokenId={seletedTokenId}
          tokenSymbol={getToken(seletedTokenId).Symbol}
          tokenName={getToken(seletedTokenId).Name}
          onTokenSelection={onTokenSelection}
        />
      </div>
      <div>
        <h4>Currency list</h4>
        {tokens.map((token, index) =>
          <div
            key={token.TokenID}
            className={clsx({ [classes.token]: index > 0 })}
          >
            <Token
              tokenId={token.TokenID}
              tokenSymbol={getToken(token.TokenID).Symbol}
              tokenName={getToken(token.TokenID).Name}
              onTokenSelection={onTokenSelection}
            />
          </div>
        )}
      </div>
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
  onTokenSelection: PropTypes.func.isRequired,
  seletedTokenId: PropTypes.number
}

export default TokenList
