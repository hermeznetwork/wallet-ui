import React from 'react'
import PropTypes from 'prop-types'
import {
  Container, Header, Divider, Button
} from 'semantic-ui-react'
import { connect } from 'react-redux'
import { Redirect, useLocation } from 'react-router-dom'

import {
  handleLoadOperator, handleLoadMetamask, handleLoadConfig
} from '../../../store/general/actions'

const config = require('../../../utils/config.json')

function InitView ({
  isAuthed,
  handleLoadOperator,
  handleLoadMetamask,
  handleLoadConfig
}) {
  const { search } = useLocation()

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)

    if (urlParams.has('node')) {
      const tokenInfura = urlParams.get('node')
      const node = `https://goerli.infura.io/v3/${tokenInfura}`

      config.nodeEth = node
    }
  }, [search])

  function checkMetamask () {
    const { ethereum } = window
    return Boolean(ethereum && ethereum.isMetaMask)
  }

  async function handleSignInMetamask () {
    if (checkMetamask()) {
      try {
        localStorage.clear()
        await handleLoadConfig(config)
        await handleLoadOperator(config)
        await handleLoadMetamask()
      } catch (error) {
        console.error(error)
      }
    }
  }

  function renderRedirect () {
    if (isAuthed === true) {
      return <Redirect to='/old/actions' />
    }
  }

  return (
    <Container textAlign='center'>
      <Header
        as='h1'
        style={{
          fontSize: '4em',
          fontWeight: 'normal',
          marginBottom: 0,
          marginTop: '3em'
        }}
      >
      Hermez
      </Header>
      <Divider />
      <Button.Group vertical>
        <Button
          content='Sign In Metamask'
          icon='plus'
          size='massive'
          color='blue'
          onClick={handleSignInMetamask}
        />
      </Button.Group>
      {renderRedirect()}
    </Container>
  )
}

InitView.propTypes = {
  isAuthed: PropTypes.bool.isRequired,
  handleLoadOperator: PropTypes.func.isRequired,
  handleLoadMetamask: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  isAuthed: state.general.isAuthed
})

export default connect(mapStateToProps, {
  handleLoadMetamask,
  handleLoadOperator,
  handleLoadConfig
})(InitView)
