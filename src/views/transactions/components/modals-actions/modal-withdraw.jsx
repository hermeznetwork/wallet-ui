import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Button, Modal, Form, Icon, Dropdown
} from 'semantic-ui-react'

import ModalError from '../modals-info/modal-error'
import ButtonGM from './gm-buttons'
import { handleSendWithdraw } from '../../../../store/tx/actions'
import { handleStateWithdraw } from '../../../../store/tx-state/actions'

function ModalWithdraw ({
  config,
  abiRollup,
  modalWithdraw,
  onToggleModalWithdraw,
  handleSendWithdraw,
  handleStateWithdraw,
  gasMultiplier,
  desWallet,
  txsExits
}) {
  const [state, setState] = React.useState({
    exitRoots: [],
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
    const tokenId = Number(state.tokenId)
    const numExitRoot = Number(state.numExitRoot)

    handleToggleModalChange()
    onToggleModalWithdraw()

    const res = await handleSendWithdraw(
      config.nodeEth,
      config.address.addressSC,
      tokenId,
      desWallet,
      abiRollup,
      config.operator,
      numExitRoot,
      gasMultiplier
    )

    if (res !== undefined) {
      if (res.message !== undefined) {
        if (res.message.includes('insufficient funds')) {
          setState({ ...state, error: '1' })
          handleToggleModalError()
        }
      }
      if (res.res) {
        handleStateWithdraw(res, tokenId)
      }
    }
  }

  async function handleGetExitRoot () {
    const txsExitsById = txsExits.filter((tx) => tx.coin === state.tokenId)
    const exitRoots = txsExitsById.map(async (key, index) => ({
      key: index,
      value: key.batch,
      text: `Batch: ${key.batch} Amount: ${key.amount}`
    }))

    setState({ ...state, exitRoots })
    handleToggleModalChange()
  }

  function idsExit () {
    const infoTxsExits = txsExits
      .filter(i => {
        const tx = txsExits[i]

        return {}.hasOwnProperty.call(txsExits, i) &&
          !infoTxsExits.find((info) => info.value === tx.coin)
      })
      .map((i) => {
        const tx = txsExits[i]

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
    if (state.exitRoots.length === 0) {
      return <Dropdown placeholder='Batch and Amount' />
    } else {
      return (
        <Dropdown
          scrolling
          placeholder='Batch and Amount'
          options={state.exitRoots}
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
  handleSendWithdraw: PropTypes.func.isRequired,
  handleStateWithdraw: PropTypes.func.isRequired,
  gasMultiplier: PropTypes.number.isRequired,
  desWallet: PropTypes.object.isRequired,
  txsExits: PropTypes.array
}

const mapStateToProps = (state) => ({
  config: state.general.config,
  abiRollup: state.general.abiRollup,
  desWallet: state.general.desWallet,
  txsExits: state.general.txsExits,
  gasMultiplier: state.general.gasMultiplier
})

export default connect(mapStateToProps, { handleSendWithdraw, handleStateWithdraw })(ModalWithdraw)
