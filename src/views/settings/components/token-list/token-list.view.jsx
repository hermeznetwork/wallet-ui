import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import Token from '../token/token.view'
import useTokenListStyles from './token-list.styles'

function TokenList ({ tokens, onTokenSelection, seletedTokenId }) {
  const classes = useTokenListStyles()

  function getToken (tokenId) {
    return tokens.find((token) => token.tokenId === tokenId)
  }

  return (
    <div>
      <div>
        <h4>Default currency</h4>
        <Token
          tokenId={seletedTokenId}
          tokenSymbol={getToken(seletedTokenId).symbol}
          tokenName={getToken(seletedTokenId).name}
          onTokenSelection={onTokenSelection}
        />
      </div>
      <div>
        <h4>Currency list</h4>
        {tokens.map((token, index) =>
          <div
            key={token.tokenId}
            className={clsx({ [classes.token]: index > 0 })}
          >
            <Token
              tokenId={token.tokenId}
              tokenSymbol={getToken(token.tokenId).symbol}
              tokenName={getToken(token.tokenId).name}
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
      tokenId: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      symbol: PropTypes.string.isRequired
    })
  ),
  onTokenSelection: PropTypes.func.isRequired,
  seletedTokenId: PropTypes.number
}

export default TokenList
