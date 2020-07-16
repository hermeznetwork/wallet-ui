/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import PropTypes from 'prop-types'
import {
  Menu, Icon, Modal, Button, Popup, Form
} from 'semantic-ui-react'
import { Link } from 'react-router-dom'

function MenuBack ({
  config,
  changeNode,
  isLoadingInfoAccount
}) {
  const [state, setState] = React.useState({
    modalHelp: false,
    loading: false,
    changeNode: false,
    flagChange: false
  })
  const nodeRef = React.createRef()

  React.useEffect(() => {
    if (isLoadingInfoAccount === true && state.changeNode === true && state.flagChange === false) {
      setState({ ...state, loading: true, flagChange: true })
    } else if (isLoadingInfoAccount === false && state.changeNode === true && state.flagChange === true) {
      setState({ ...state, loading: false, changeNode: false, flagChange: false })
    }
  }, [isLoadingInfoAccount, state, setState])

  function handleToggleModalHelp () {
    setState({ ...state, modalHelp: !state.modalHelp })
  }

  function handleClickChangeNode () {
    const currentNode = nodeRef.current.value

    setState({ ...state, changeNode: true })
    changeNode(currentNode)
  }

  function loadingIcon () {
    if (state.loading) {
      return <Icon name='circle notched' loading />
    }
  }

  return (
    <Menu secondary size='large'>
      <Menu.Menu position='left'>
        <Menu.Item>
          <Popup
            position='bottom left'
            flowing
            on='click'
            trigger={<Button content='Change Node' icon='ethereum' basic />}
          >
            <Form>
              <label htmlFor='nodeEth'>
                <b>Url Node Ethereum: </b>
                <input type='text' id='node' size='40' defaultValue={config.nodeEth} ref={nodeRef} />
                <Button onClick={handleClickChangeNode}>Change Node</Button>
                {loadingIcon()}
              </label>
            </Form>
          </Popup>
          <Button content='Help' icon='help' basic onClick={handleToggleModalHelp} />
        </Menu.Item>
      </Menu.Menu>
      <Menu.Menu position='right'>
        <Link to='/'>
          <Menu.Item name='initView'>
            <Icon name='reply' />
              Back
          </Menu.Item>
        </Link>
      </Menu.Menu>
      <Modal open={state.modalHelp}>
        <Modal.Header>
          <Icon name='help circle' />
            Help
        </Modal.Header>
        <Modal.Content>
          <p>Transactions:</p>
          <p>
            <dd>
              <b>Onchain</b>
                : we need ether to be able to perform them
            </dd>
          </p>
          <p><dd> - Deposit: insert tokens within the rollup network</dd></p>
          <p>
            <dd>
                    - Withdraw: take back tokens from the rollup contract
              (you must send an “Off-chain Exit” before or “On-chain force exit”)
            </dd>
          </p>
          <p><dd> - Force Exit: exit tokens from rollup network</dd></p>
          <p>
            <dd>
              <b>Offchain</b>
                : we previously need to make a deposit and have tokens in the rollup network
            </dd>
          </p>
          <p><dd> - Send: send tokens from one rollup ID to another rollup ID</dd></p>
          <p><dd> - Exit: exit tokens from rollup network</dd></p>
          <p>Tokens:</p>
          <p>
            <dd>- What are tokens for?</dd>
          </p>
          <p>
            <dd>
                They are the “coins” that you can use to interact with the rollup.
                Currently supports ERC20 standard tokens.
            </dd>
          </p>
          <p>
            <dd>
                - How can I get them?
            </dd>
          </p>
          <p>
            <dd>
                Sending an on-chain transaction with the “GET TOKENS” button.
                You need to have ETHER in order to send above transaction.
            </dd>
          </p>
          <p>
            <dd>
                - How can I get ether?
            </dd>
          </p>
          <p>
            <dd>
              By clicking the “GET ETHER” button and putting your ethereum address in the faucet.
            </dd>
          </p>
          <p>Approve:</p>
          <p>
            <dd>
                - What is the purpose of approving tokens?
            </dd>
          </p>
          <p>
            <dd>
              When you approve the tokens, you are giving permission to the ROLLUP contract to transfer your tokens
              indicated in the transaction when making a DEPOSIT.
            </dd>
          </p>
          <p>
            <dd>
                - How do I approve?
            </dd>
          </p>
          <p>
            <dd>
              Indicating the number of tokens you want to approve and clicking the “APPROVE” button.
              You will need ether since you are sending an on-chain transaction.
            </dd>
          </p>
          <p>ID's:</p>
          <p>
            <dd>
                - What are the IDs?
            </dd>
          </p>
          <p>
            <dd>
                It is the identifier of your account inside the rollup network.
                A new rollup ID will be created each time you perform a deposit.
            </dd>
          </p>
          <p>
            <dd>
                - How should I use the ID?
            </dd>
          </p>
          <p>
            <dd>
              When you want to make a transfer you must choose the rollup ID
              of the account from which you want to make the transfer.
              You must also indicate the rollup ID of the recipient rollup account.
            </dd>
          </p>
        </Modal.Content>
        <Modal.Actions>
          <Button color='blue' onClick={handleToggleModalHelp}>
              OK
          </Button>
        </Modal.Actions>
      </Modal>
    </Menu>
  )
}

MenuBack.propTypes = {
  config: PropTypes.object.isRequired,
  changeNode: PropTypes.func.isRequired,
  isLoadingInfoAccount: PropTypes.bool.isRequired
}

export default MenuBack
