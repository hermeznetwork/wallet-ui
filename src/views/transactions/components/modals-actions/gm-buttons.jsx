import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'

import { selectGasMultiplier } from '../../../../store/general/actions'

const GAS_MULTIPLIER = {
  SLOW: 1,
  AVG: 2,
  FAST: 3
}

function ButtonGM ({
  selectGasMultiplier
}) {
  const [state, setState] = React.useState({
    slow: false,
    avg: true,
    fast: false
  })

  function selectActive (num) {
    if (num === GAS_MULTIPLIER.SLOW) {
      setState({ slow: true, avg: false, fast: false })
    } else if (num === GAS_MULTIPLIER.AVG) {
      setState({ slow: false, avg: true, fast: false })
    } else if (num === GAS_MULTIPLIER.FAST) {
      setState({ slow: false, avg: false, fast: true })
    } else {
      setState({ slow: false, avg: false, fast: false })
    }
  }

  function changeGasMultiplier (num, event) {
    event.preventDefault()
    selectGasMultiplier(num)
    selectActive(num)
  }

  return (
    <Button.Group>
      <Button
        onClick={(event) => changeGasMultiplier(GAS_MULTIPLIER.SLOW, event)}
        active={state.slow}
      >
        Slow
      </Button>
      <Button.Or />
      <Button
        onClick={(event) => changeGasMultiplier(GAS_MULTIPLIER.AVG, event)}
        active={state.avg}
      >
        Avg
      </Button>
      <Button.Or />
      <Button
        onClick={(event) => changeGasMultiplier(GAS_MULTIPLIER.FAST, event)}
        active={state.fast}
      >
        Fast
      </Button>
    </Button.Group>
  )
}

ButtonGM.propTypes = {
  selectGasMultiplier: PropTypes.func.isRequired
}

export default connect(null, { selectGasMultiplier })(ButtonGM)
