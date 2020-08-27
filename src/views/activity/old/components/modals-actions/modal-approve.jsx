import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Button, Modal, Form, Icon
} from 'semantic-ui-react'

import ModalError from '../modals-info/modal-error'
import ButtonGM from './gm-buttons'
// import { handleApprove } from '../../../../../store/tx/actions'
// import { getWei } from '../../../../../utils/utils'

function ModalApprove ({
  config,
  abiTokens,
  modalApprove,
  onToggleModalApprove,
  // handleApprove,
  gasMultiplier
}) {
  const [amount, setAmount] = React.useState(0)
  const [addressTokens, setAddressTokens] = React.useState('')
  const [state, setState] = React.useState({
    modalError: false,
    error: ''
  })
  const amountTokensRef = React.createRef()

  function handleToggleModalError () {
    setState({ ...state, modalError: !state.modalError })
  }

  function handleToggleModalClose () {
    onToggleModalApprove()
    setAddressTokens('')
    setAmount(0)
  }

  async function handleClickApprove () {
    // const amountTokens = getWei(amount)
    // const res = await handleApprove(
    //   addressTokens,
    //   abiTokens,
    //   amountTokens,
    //   config.address,
    //   gasMultiplier
    // )

    // handleToggleModalClose()
    // if (res.message !== undefined) {
    //   if (res.message.includes('insufficient funds')) {
    //     setState({ ...state, error: '1' })
    //     handleToggleModalError()
    //   }
    // }
  }

  function isFormValid () {
    return Boolean(parseInt(amount, 10) && addressTokens !== '')
  }

  function handleSetAmount () {
    setAmount(amountTokensRef.current.value)
  }

  function handleGetExampleAddress () {
    setAddressTokens(config.tokensAddress)
  }

  function handleChangeAddress (event) {
    setAddressTokens(event.target.value)
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
          <Button onClick={handleClickApprove} color='blue' disabled={!isFormValid()}>
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
  // handleApprove: PropTypes.func.isRequired,
  gasMultiplier: PropTypes.number.isRequired
}

const mapStateToProps = (state) => ({
  config: state.general.config,
  abiTokens: state.general.abiTokens,
  gasMultiplier: state.general.gasMultiplier
})

export default connect(
  mapStateToProps,
  {
    // handleApprove
  }
)(ModalApprove)
