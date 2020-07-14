import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Icon, Container, Menu, Dropdown, Segment
} from 'semantic-ui-react'

function MenuActions ({
  onItemClick,
  noImported,
  tokensA,
  tokensR,
  tokensE,
  balance,
  isLoadingInfoAccount
}) {
  const [state, setState] = React.useState({
    onChainDisabled: false,
    offChainDisabled: false,
    getResourcesDisabled: false,
    depositDisabled: false,
    withdrawDisabled: false,
    forcexitDisabled: false,
    sendDisabled: false,
    exitDisabled: false,
    getTokensDisabled: false,
    approveTokensDisabled: false
  })

  React.useEffect(() => {
    if (isLoadingInfoAccount) {
      this.setState({
        onChainDisabled: true,
        offChainDisabled: true,
        getResourcesDisabled: true
      })
    } else {
      this.setState({
        onChainDisabled: false,
        offChainDisabled: false,
        getResourcesDisabled: false,
        getTokensDisabled: false,
        approveTokensDisabled: false
      })
      if (Number(balance) === 0) {
        this.setState({
          depositDisabled: true,
          withdrawDisabled: true,
          forcexitDisabled: true,
          getTokensDisabled: true,
          approveTokensDisabled: true
        })
      }
      if (Number(tokensA) === 0) {
        this.setState({
          depositDisabled: true
        })
      }
      if (Number(tokensR) === 0) {
        this.setState({
          sendDisabled: true,
          exitDisabled: true,
          forcexitDisabled: true
        })
      }
      if (Number(tokensE) === 0) {
        this.setState({
          withdrawDisabled: true
        })
      }
    }
  }, [isLoadingInfoAccount, balance, tokensA, tokensE, tokensR, state, setState])

  React.useEffect(() => {
    if (Number(tokensA) === 0 || Number(balance) === 0) {
      this.setState({ depositDisabled: true })
    } else {
      this.setState({ depositDisabled: false })
    }
  }, [tokensA, balance, state, setState])

  React.useEffect(() => {
    if (Number(tokensR) === 0 || Number(balance) === 0) {
      this.setState({
        sendDisabled: true,
        exitDisabled: true,
        forcexitDisabled: true
      })
    } else {
      this.setState({
        sendDisabled: false,
        exitDisabled: false,
        forcexitDisabled: false
      })
    }
  }, [tokensR, balance, state, setState])

  React.useEffect(() => {
    if (Number(tokensE) === 0 || Number(balance) === 0) {
      this.setState({ withdrawDisabled: true })
    } else {
      this.setState({ withdrawDisabled: false })
    }
  }, [tokensE, balance, state, setState])

  React.useEffect(() => {
    if (Number(balance) === 0) {
      this.setState({ getTokensDisabled: true, approveTokensDisabled: true })
    } else {
      this.setState({ getTokensDisabled: false, approveTokensDisabled: false })
    }
  }, [balance, state, setState])

  return (
    <Container>
      <Segment color='blue' inverted secondary>
        <b>ACTIONS</b>
      </Segment>
      <Menu widths='3'>
        <Dropdown
          trigger={(
            <span>
              <Icon name='ethereum' />
                ON-CHAIN
            </span>
          )}
          pointing
          className='icon item'
          disabled={noImported || state.onChainDisabled}
        >
          <Dropdown.Menu>
            <Dropdown.Item
              name='deposit'
              onClick={onItemClick}
              disabled={noImported || state.depositDisabled}
            >
              <Segment textAlign='center'>
                <Icon name='sign-in' />
                  DEPOSIT
              </Segment>
            </Dropdown.Item>
            <Dropdown.Item
              name='withdraw'
              onClick={onItemClick}
              disabled={noImported || state.withdrawDisabled}
            >
              <Segment textAlign='center'>
                <Icon name='sign-out' />
                  WITHDRAW
              </Segment>
            </Dropdown.Item>
            <Dropdown.Item
              name='forcexit'
              onClick={onItemClick}
              disabled={noImported || state.forcexitDisabled}
            >
              <Segment textAlign='center'>
                <Icon name='reply' />
                  FORCE EXIT
              </Segment>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown
          trigger={(
            <span>
              <Icon name='life ring' />
                OFF-CHAIN
            </span>
          )}
          pointing
          className='icon item'
          disabled={noImported || state.offChainDisabled}
        >
          <Dropdown.Menu>
            <Dropdown.Item name='send' onClick={onItemClick} disabled={noImported || state.sendDisabled}>
              <Segment textAlign='center'>
                <Icon name='exchange' />
                  SEND
              </Segment>
            </Dropdown.Item>
            <Dropdown.Item name='send0' onClick={onItemClick} disabled={noImported || state.exitDisabled}>
              <Segment textAlign='center'>
                <Icon name='reply' />
                  EXIT
              </Segment>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown
          trigger={(
            <span>
              <Icon name='cogs' />
                GET RESOURCES
            </span>
          )}
          pointing
          className='icon item'
          disabled={noImported || state.getResourcesDisabled}
        >
          <Dropdown.Menu>
            <Dropdown.Item>
              <a href='https://goerli-faucet.slock.it/' target='_blank' rel='noopener noreferrer'>
                <Segment textAlign='center'>
                  <Icon name='arrow circle right' color='blue' />
                    GET ETHER
                </Segment>
              </a>
            </Dropdown.Item>
            <Dropdown.Item
              name='getTokens'
              onClick={onItemClick}
              disabled={noImported || state.getTokensDisabled}
            >
              <Segment textAlign='center'>
                <Icon name='cart arrow down' />
                  GET TOKENS
              </Segment>
            </Dropdown.Item>
            <Dropdown.Item
              name='approve'
              onClick={onItemClick}
              disabled={noImported || state.approveTokensDisabled}
            >
              <Segment textAlign='center'>
                <Icon name='checkmark' />
                  APPROVE TOKENS
              </Segment>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Menu>
    </Container>
  )
}

MenuActions.propTypes = {
  onItemClick: PropTypes.func.isRequired,
  noImported: PropTypes.bool.isRequired,
  tokensA: PropTypes.string.isRequired,
  tokensR: PropTypes.string.isRequired,
  tokensE: PropTypes.string.isRequired,
  balance: PropTypes.string.isRequired,
  isLoadingInfoAccount: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => ({
  balance: state.general.balance,
  tokensR: state.general.tokensR,
  tokensA: state.general.tokensA,
  tokensE: state.general.tokensE,
  isLoadingInfoAccount: state.general.isLoadingInfoAccount
})

export default connect(mapStateToProps, {})(MenuActions)
