import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Button, Modal, Form, Icon
} from 'semantic-ui-react'

import ModalError from '../modals-info/modal-error'
import ButtonGM from './gm-buttons'
import { handleApprove } from '../../../../../store/tx/actions'
import { getWei } from '../../../../../utils/utils'

function ModalApprove ({
  config,
  abiTokens,
  modalApprove,
  onToggleModalApprove,
  handleApprove,
  gasMultiplier,
  metamaskWallet
}) {
  const [addressTokens, setAddressTokens] = React.useState('')
  const [state, setState] = React.useState({
    modalError: false,
    error: '',
    amount: '',
    disableButton: true
  })
  const amountTokensRef = React.createRef()

  function handleToggleModalError () {
    setState({ ...state, modalError: !state.modalError })
  }

  function handleToggleModalClose () {
    onToggleModalApprove()
    setState({
      ...state,
      disableButton: true,
      amount: ''
    })
    setAddressTokens('')
  }

  async function handleClickApprove () {
    const amountTokens = getWei(state.amount)
    const res = await handleApprove(
      addressTokens,
      abiTokens,
      metamaskWallet,
      amountTokens,
      config.address,
      config.nodeEth,
      gasMultiplier
    )

    handleToggleModalClose()
    setState({ ...state, disableButton: true })
    if (res.message !== undefined) {
      if (res.message.includes('insufficient funds')) {
        setState({ ...state, error: '1' })
        handleToggleModalError()
      }
    }
  }

  function checkForm () {
    console.log(state.amount, addressTokens)
    console.log(parseInt(state.amount, 10), addressTokens !== '')
    if (parseInt(state.amount, 10) && addressTokens !== '') {
      setState({ ...state, disableButton: false })
    } else {
      setState({ ...state, disableButton: true })
    }
  }

  function handleSetAmount () {
    setState({ ...state, amount: amountTokensRef.current.value })
    checkForm()
  }

  function handleGetExampleAddress () {
    setAddressTokens(config.tokensAddress)
    checkForm()
  }

  function handleChangeAddress (event) {
    setAddressTokens(event.target.value)
    checkForm()
  }

  return (
    <div>
      <ModalError
        error={state.error}
        modalError={state.modalError}
        onToggleModalError={handleToggleModalError}
      />
      <Modal open={modalApprove}>
        <Modal.Header>Approve Tokens</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <label htmlFor='amountToken'>
                Amount Tokens:
                <input type='text' ref={amountTokensRef} onChange={handleSetAmount} id='amountToken' />
              </label>
            </Form.Field>
            <Form.Field>
              <label htmlFor='addressTokens'>
                  Address SC Tokens:
                <input
                  type='text'
                  id='baby-ax-r'
                  value={addressTokens}
                  onChange={handleChangeAddress}
                  size='40'
                />
                <Button
                  content='Fill with example address'
                  labelPosition='right'
                  floated='right'
                  onClick={handleGetExampleAddress}
                />
              </label>
            </Form.Field>
            <Form.Field>
              <ButtonGM />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={handleClickApprove} color='blue' disabled={state.disableButton}>
            <Icon name='ethereum' />
              APPROVE
          </Button>
          <Button color='grey' basic onClick={handleToggleModalClose}>
            <Icon name='close' />
              Close
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  )
}

ModalApprove.propTypes = {
  config: PropTypes.object.isRequired,
  abiTokens: PropTypes.array.isRequired,
  modalApprove: PropTypes.bool.isRequired,
  onToggleModalApprove: PropTypes.func.isRequired,
  handleApprove: PropTypes.func.isRequired,
  gasMultiplier: PropTypes.number.isRequired,
  metamaskWallet: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  config: state.general.config,
  abiTokens: state.general.abiTokens,
  metamaskWallet: state.general.metamaskWallet,
  gasMultiplier: state.general.gasMultiplier
})

export default connect(mapStateToProps, { handleApprove })(ModalApprove)
