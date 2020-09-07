import React from 'react'
import PropTypes from 'prop-types'

import useTokenListStyles from './token-list.styles'
import TokenListItem from '../token-list-item/token-list-item.view'

function TokenList ({
  tokens
}) {
  const classes = useTokenListStyles()

  function handleTokenListItemClick () {

  }

  return (
    <ul className={classes.tokenList}>
      {tokens.map((token) => {
        return (
          <TokenListItem
            key={token.tokenId}
            token={token}
            onClick={handleTokenListItemClick}
          />
        )
      })}
    </ul>
  )
}

TokenList.propTypes = {
  tokens: PropTypes.arrayOf(
    PropTypes.shape({
      balance: PropTypes.number.isRequired,
      tokenId: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      symbol: PropTypes.string.isRequired
    })
  )
}

export default TokenList
