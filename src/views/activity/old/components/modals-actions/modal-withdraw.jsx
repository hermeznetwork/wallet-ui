import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Button, Modal, Form, Icon, Dropdown
} from 'semantic-ui-react'

import ModalError from '../modals-info/modal-error'
import ButtonGM from './gm-buttons'

function ModalWithdraw ({
  config,
  abiRollup,
  modalWithdraw,
  onToggleModalWithdraw,
  gasMultiplier,
  metamaskWallet,
  txsExits
}) {
  const [exitRoots, setExitRoots] = React.useState([])
  const [state, setState] = React.useState({
    numExitRoot: -1,
    tokenId: -1,
    initModal: true,
    modalError: false,
    nextDisabled: true,
    sendDisabled: true,
    error: ''
  })

  function handleToggleModalError () {
    setState({ ...state, modalError: !state.modalError })
  }

  function handleToggleModalChange () {
    if (state.initModal === true) {
      setState({ ...state, initModal: false })
    } else {
      setState({ ...state, initModal: true, nextDisabled: true, sendDisabled: true })
    }
  }

  function handleToggleCloseModal () {
    handleToggleModalChange()
    onToggleModalWithdraw()
  }

  async function handleClick () {
    handleToggleModalChange()
    onToggleModalWithdraw()
  }

  async function handleGetExitRoot () {
    const exitRoots = txsExits
      .filter((tx) => tx.coin === state.tokenId)
      .map((key) => ({
        key: key.batch,
        value: key.batch,
        text: `Batch: ${key.batch} Amount: ${key.amount}`
      }))

    setExitRoots(exitRoots)
    handleToggleModalChange()
  }

  function idsExit () {
    const infoTxsExits = txsExits.map((tx, i) => {
      return { key: i, value: tx.coin, text: tx.coin }
    })

    if (infoTxsExits.length === 0) {
      return <Dropdown placeholder='ID' />
    }

    return (
      <Dropdown
        scrolling
        placeholder='ID'
        options={infoTxsExits}
        onChange={handleChangeIdFrom}
      />
    )
  }

  function handleChangeIdFrom (e, { value }) {
    setState({ ...state, tokenId: value, nextDisabled: false })
  }

  function exitRoot () {
    if (exitRoots.length === 0) {
      return <Dropdown placeholder='Batch and Amount' />
    } else {
      return (
        <Dropdown
          scrolling
          placeholder='Batch and Amount'
          options={exitRoots}
          onChange={handleChange}
        />
      )
    }
  }

  function handleChange (e, { value }) {
    setState({ ...state, numExitRoot: value, sendDisabled: false })
  }

  return (
    <div>
      <ModalError
        error={state.error}
        modalError={state.modalError}
        onToggleModalError={handleToggleModalError}
      />
      {state.initModal === true
        ? (
          <Modal open={modalWithdraw}>
            <Modal.Header>Withdraw</Modal.Header>
            <Modal.Content>
              <Form>
                <Form.Field>
                  <p><b>Coin</b></p>
                  {idsExit()}
                </Form.Field>
              </Form>
            </Modal.Content>
            <Modal.Actions>
              <Button color='blue' onClick={handleGetExitRoot} disabled={state.nextDisabled}>
                <Icon name='arrow right' />
              Next
              </Button>
              <Button color='grey' basic onClick={onToggleModalWithdraw}>
                <Icon name='close' />
              Close
              </Button>
            </Modal.Actions>
          </Modal>
        )
        : (
          <Modal open={modalWithdraw}>
            <Modal.Header>Withdraw</Modal.Header>
            <Modal.Content>
              <Form>
                <Form.Field>
                  <p><b>Coin</b></p>
                  <p>{state.tokenId}</p>
                </Form.Field>
                <Form.Field>
                  <p><b>Batch and Amount</b></p>
                  {exitRoot()}
                </Form.Field>
                <Form.Field>
                  <ButtonGM />
                </Form.Field>
              </Form>
            </Modal.Content>
            <Modal.Actions>
              <Button color='blue' onClick={handleToggleModalChange}>
                <Icon name='arrow left' />
            Previous
              </Button>
              <Button color='blue' onClick={handleClick} disabled={state.sendDisabled}>
                <Icon name='sign-out' />
            Withdraw
              </Button>
              <Button color='grey' basic onClick={handleToggleCloseModal}>
                <Icon name='close' />
            Close
              </Button>
            </Modal.Actions>
          </Modal>
        )}
    </div>
  )
}

ModalWithdraw.propTypes = {
  config: PropTypes.object.isRequired,
  abiRollup: PropTypes.array.isRequired,
  modalWithdraw: PropTypes.bool.isRequired,
  onToggleModalWithdraw: PropTypes.func.isRequired,
  gasMultiplier: PropTypes.number.isRequired,
  metamaskWallet: PropTypes.object.isRequired,
  txsExits: PropTypes.array
}

const mapStateToProps = (state) => ({
  config: state.general.config,
  abiRollup: state.general.abiRollup,
  metamaskWallet: state.general.metamaskWallet,
  txsExits: state.general.txsExits,
  gasMultiplier: state.general.gasMultiplier
})

export default connect(mapStateToProps)(ModalWithdraw)
