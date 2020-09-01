import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Button, Modal, Form, Icon, Dropdown
} from 'semantic-ui-react'

import {
  feeTableDropdown
} from '../../../../../utils/utils'

const rollupExampleAddress = '0x5b2ae71f33a4e3455cb4d25bf076189093c4beac4d0fd5f8ea538c5b3d1ad8a0'

function ModalSend ({
  config,
  modalSend,
  onToggleModalSend,
  metaMaskWallet,
  babyjub,
  activeItem,
  tokensRArray,
  pendingOffchain
}) {
  const [amount, setAmount] = React.useState(0)
  const [tokenId, setTokenId] = React.useState('')
  const [babyJubReceiver, setBabyJubReceiver] = React.useState('')
  const [fee, setFee] = React.useState('')

  React.useEffect(() => {
    if (babyJubReceiver === '' && activeItem === 'send0') {
      setBabyJubReceiver('exit')
    } else if (babyJubReceiver === 'exit' && activeItem === 'send') {
      setBabyJubReceiver('')
    }
  }, [activeItem, babyJubReceiver, setBabyJubReceiver])

  function handleCloseModal () {
    onToggleModalSend()
    setAmount(0)
    setFee('')
    setTokenId('')
    setBabyJubReceiver('')
  }

  async function handleClick () {
    handleCloseModal()
  }

  function isFormValid () {
    return Boolean(parseInt(amount, 10) && fee !== '' && babyJubReceiver !== '' && (parseInt(tokenId, 10) || tokenId === 0))
  }

  function handleSetAmount (event) {
    setAmount(event.target.value)
  }

  function handleSetToken (_, { value }) {
    const tokenId = Number(value)

    setTokenId(tokenId)
  }

  function handleSetFee (_, { value }) {
    setFee(value)
  }

  function handleGetExampleAddress () {
    setBabyJubReceiver(rollupExampleAddress)
  }

  function handleChangeReceiver (event) {
    setBabyJubReceiver(event.target.value)
  }

  function receiverBySend () {
    if (activeItem === 'send') {
      return (
        <label htmlFor='babyjub-to'>
          Receiver BabyJubJub Address
          <input
            type='text'
            id='baby-ax-r'
            value={babyJubReceiver}
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
    const tokensOptions = tokensRArray.map((token) => ({
      key: token.address,
      value: token.tokenId,
      text: `${token.tokenId}: ${token.address}`
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
                  value={amount}
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
          <Button color='blue' onClick={handleClick} disabled={!isFormValid()}>
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
  metaMaskWallet: PropTypes.object.isRequired,
  babyjub: PropTypes.string.isRequired,
  activeItem: PropTypes.string.isRequired,
  tokensRArray: PropTypes.array.isRequired,
  pendingOffchain: PropTypes.array.isRequired
}

const mapStateToProps = (state) => ({
  config: state.general.config,
  metaMaskWallet: state.general.metaMaskWallet,
  pendingOffchain: state.txState.pendingOffchain
})

export default connect(mapStateToProps)(ModalSend)
