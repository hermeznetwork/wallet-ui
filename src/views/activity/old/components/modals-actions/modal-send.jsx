import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Button, Modal, Form, Icon, Dropdown
} from 'semantic-ui-react'

import { handleSendSend } from '../../../../../store/tx/actions'
import { handleStateSend } from '../../../../../store/tx-state/actions'
import {
  getWei, feeTable, feeTableDropdown
} from '../../../../../utils/utils'

const rollupExampleAddress = '0x5b2ae71f33a4e3455cb4d25bf076189093c4beac4d0fd5f8ea538c5b3d1ad8a0'

function ModalSend ({
  config,
  modalSend,
  onToggleModalSend,
  onSendSend,
  onStateEnd,
  metamaskWallet,
  babyjub,
  activeItem,
  tokensRArray,
  pendingOffchain
}) {
  const [state, setState] = React.useState({
    babyJubReceiver: '',
    amount: '',
    fee: '',
    tokenId: '',
    sendDisabled: true
  })

  React.useEffect(() => {
    if (state.babyJubReceiver === '' && activeItem === 'send0') {
      setState({ ...state, babyJubReceiver: 'exit' })
    } else if (state.babyJubReceiver === 'exit' && activeItem === 'send') {
      setState({ ...state, babyJubReceiver: '' })
    }
  }, [activeItem, state, setState])

  function handleCloseModal () {
    onToggleModalSend()
    setState({
      ...state,
      babyJubReceiver: '',
      amount: '',
      fee: '',
      tokenId: '',
      sendDisabled: true
    })
  }

  async function handleClick () {
    const amountWei = getWei(state.amount)

    handleCloseModal()

    const res = await onSendSend(
      config.operator,
      state.babyJubReceiver,
      amountWei,
      metamaskWallet,
      state.tokenId,
      feeTable[state.fee]
    )

    if (res.nonce || res.nonce === 0) {
      onStateEnd(
        res,
        config.operator,
        amountWei,
        state.fee,
        state.tokenId,
        state.babyJubReceiver,
        pendingOffchain,
        babyjub
      )
    }
  }

  function checkForm () {
    if (parseInt(state.amount, 10) && state.fee !== '' && state.babyJubReceiver !== '' && (parseInt(state.tokenId, 10) || state.tokenId === 0)) {
      setState({ ...state, sendDisabled: false })
    } else {
      setState({ ...state, sendDisabled: true })
    }
  }

  function handleSetAmount (event) {
    setState({ ...state, amount: event.target.value })
    checkForm()
  }

  function handleSetToken (event, { value }) {
    const tokenId = Number(value)

    setState({ ...state, tokenId })
    checkForm()
  }

  function handleSetFee (event, { value }) {
    setState({ ...state, fee: value })
    checkForm()
  }

  function handleGetExampleAddress () {
    setState({ ...state, babyJubReceiver: rollupExampleAddress })
    checkForm()
  }

  function handleChangeReceiver (event) {
    setState({ ...state, babyJubReceiver: event.target.value })
    checkForm()
  }

  function receiverBySend () {
    if (activeItem === 'send') {
      return (
        <label htmlFor='babyjub-to'>
          Receiver BabyJubJub Address
          <input
            type='text'
            id='baby-ax-r'
            value={state.babyJubReceiver}
            onChange={handleChangeReceiver}
          />
          <Button
            content='Fill with example address'
            labelPosition='right'
            floated='right'
            onClick={handleGetExampleAddress}
          />
        </label>
      )
    }
  }

  function dropDownTokens () {
    const tokensOptions = tokensRArray.filter(token => tokensRArray[token]).map((token) => ({
      key: tokensRArray[token].address,
      value: tokensRArray[token].tokenId,
      text: `${tokensRArray[token].tokenId}: ${tokensRArray[token].address}`
    }))

    return (
      <Dropdown
        placeholder='token'
        options={tokensOptions}
        onChange={handleSetToken}
        scrolling
      />
    )
  }

  return (
    <div>
      <Modal open={modalSend}>
        <Modal.Header>Send</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <label htmlFor='babyjub-from'>
                Sender BabyJubJub Address
                <input
                  type='text'
                  defaultValue={babyjub}
                  id='baby-ax-s'
                  disabled
                />
              </label>
              {receiverBySend()}
            </Form.Field>
            <Form.Field>
              <label htmlFor='amount'>
                Amount
                <input
                  type='text'
                  id='amount'
                  onChange={handleSetAmount}
                  value={state.amount}
                />
              </label>
            </Form.Field>
            <Form.Field>
              <label htmlFor='token-id'>
                Token ID
              </label>
              {dropDownTokens()}
            </Form.Field>
            <Form.Field>
              <p><b>Fee</b></p>
              <Dropdown
                placeholder='fee'
                options={feeTableDropdown}
                onChange={handleSetFee}
                scrolling
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color='blue' onClick={handleClick} disabled={state.sendDisabled}>
            <Icon name='share' />
              Send
          </Button>
          <Button color='grey' basic onClick={handleCloseModal}>
            <Icon name='close' />
              Close
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  )
}

ModalSend.propTypes = {
  config: PropTypes.object.isRequired,
  modalSend: PropTypes.bool.isRequired,
  onToggleModalSend: PropTypes.func.isRequired,
  onSendSend: PropTypes.func.isRequired,
  onStateEnd: PropTypes.func.isRequired,
  metamaskWallet: PropTypes.object.isRequired,
  babyjub: PropTypes.string.isRequired,
  activeItem: PropTypes.string.isRequired,
  tokensRArray: PropTypes.array.isRequired,
  pendingOffchain: PropTypes.array.isRequired
}

const mapStateToProps = (state) => ({
  config: state.general.config,
  metamaskWallet: state.general.metamaskWallet,
  pendingOffchain: state.txState.pendingOffchain
})

export default connect(mapStateToProps, {
  onSendSend: handleSendSend,
  onStateEnd: handleStateSend
})(ModalSend)
