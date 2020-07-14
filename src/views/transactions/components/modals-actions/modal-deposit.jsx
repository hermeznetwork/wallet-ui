import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Button, Modal, Form, Icon, Dropdown
} from 'semantic-ui-react'

import ModalError from '../modals-info/modal-error'
import ButtonGM from './gm-buttons'
import { handleSendDeposit } from '../../../../store/tx/actions'
import { handleStateDeposit } from '../../../../store/tx-state/actions'
import { getWei } from '../../../../utils/utils'

function ModalDeposit ({
  config,
  abiRollup,
  modalDeposit,
  onToggleModalDeposit,
  onSendDeposit,
  onStateDeposit,
  tokensList,
  tokensA,
  gasMultiplier,
  desWallet
}) {
  const [state, setState] = React.useState({
    modalError: false,
    error: '',
    tokenId: '',
    amount: '',
    disableButton: true
  })

  function checkForm () {
    if (parseInt(state.amount, 10) && (parseInt(state.tokenId, 10) || state.tokenId === 0)) {
      setState({ ...state, disableButton: false })
    } else {
      setState({ ...state, disableButton: true })
    }
  }

  function handleToggleModalError () {
    setState({ ...state, modalError: !state.modalError })
  }

  function handleToggleModalClose () {
    onToggleModalDeposit()
    setState({
      ...state,
      modalError: false,
      error: '',
      tokenId: '',
      amount: '',
      disableButton: true
    })
  }

  async function handleClick () {
    const amount = getWei(state.amount)
    const addressSC = config.address
    if (parseInt(amount, 10) > parseInt(tokensA, 10)) {
      setState({ ...state, error: '0' })
      handleToggleModalError()
    } else {
      onToggleModalDeposit()
      setState({ ...state, disableButton: true })
      const res = await onSendDeposit(
        config.nodeEth,
        addressSC,
        amount,
        state.tokenId,
        desWallet,
        undefined,
        abiRollup,
        gasMultiplier,
        config.operator
      )
      const walletEthAddress = desWallet.ethWallet.address
      const filters = {}
      if (walletEthAddress.startsWith('0x')) filters.ethAddr = walletEthAddress
      if (res.message !== undefined) {
        if (res.message.includes('insufficient funds')) {
          setState({ ...state, error: '1' })
          handleToggleModalError()
        }
      }
      if (res.res) {
        onStateDeposit(res, state.tokenId, config.operator, amount)
      }
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

  function dropDownTokens () {
    const tokensOptions = tokensList
      .filter(token => tokensList[token])
      .map((token) => ({
        key: tokensList[token].address,
        value: tokensList[token].tokenId,
        text: `${tokensList[token].tokenId}: ${tokensList[token].address}`
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
      <ModalError
        error={state.error}
        modalError={state.modalError}
        onToggleModalError={handleToggleModalError}
      />
      <Modal open={modalDeposit}>
        <Modal.Header>Deposit</Modal.Header>
        <Modal.Content>
          <Form>
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
              <ButtonGM />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color='blue' onClick={handleClick} disabled={state.disableButton}>
            <Icon name='sign-in' />
            Deposit
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

ModalDeposit.propTypes = {
  config: PropTypes.object.isRequired,
  abiRollup: PropTypes.array.isRequired,
  modalDeposit: PropTypes.bool.isRequired,
  onToggleModalDeposit: PropTypes.func.isRequired,
  onSendDeposit: PropTypes.func.isRequired,
  onStateDeposit: PropTypes.func.isRequired,
  tokensList: PropTypes.array.isRequired,
  tokensA: PropTypes.string.isRequired,
  gasMultiplier: PropTypes.number.isRequired,
  desWallet: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  config: state.general.config,
  abiRollup: state.general.abiRollup,
  desWallet: state.general.desWallet,
  gasMultiplier: state.general.gasMultiplier,
  pendingOnchain: state.txState.pendingOnchain
})

export default connect(
  mapStateToProps,
  {
    onSendDeposit: handleSendDeposit,
    onStateDeposit: handleStateDeposit
  }
)(ModalDeposit)
