import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Button, Modal, Form, Icon, Dropdown
} from 'semantic-ui-react'

import ModalError from '../modals-info/modal-error'
import ButtonGM from './gm-buttons'
import { handleSendDeposit } from '../../../../../store/tx/actions'
import { handleStateDeposit } from '../../../../../store/tx-state/actions'
import { getWei } from '../../../../../utils/utils'

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
  metamaskWallet
}) {
  const [amount, setAmount] = React.useState(0)
  const [tokenId, setTokenId] = React.useState()
  const [state, setState] = React.useState({
    modalError: false,
    error: ''
  })

  function isFormValid () {
    return Boolean(parseInt(amount, 10) && (parseInt(tokenId, 10) || tokenId === 0))
  }

  function handleToggleModalError () {
    setState({ ...state, modalError: !state.modalError })
  }

  function handleToggleModalClose () {
    onToggleModalDeposit()
    setAmount(0)
    setState({
      ...state,
      modalError: false,
      error: ''
    })
  }

  async function handleClick () {
    const depositAmount = getWei(amount)
    const addressSC = config.address
    if (parseInt(depositAmount, 10) > parseInt(tokensA, 10)) {
      setState({ ...state, error: '0' })
      handleToggleModalError()
    } else {
      onToggleModalDeposit()
      const res = await onSendDeposit(
        addressSC,
        depositAmount,
        tokenId,
        metamaskWallet,
        abiRollup,
        gasMultiplier,
        config.operator
      )
      console.log(res)
      const walletEthAddress = metamaskWallet.publicEthKey
      const filters = {}
      if (walletEthAddress.startsWith('0x')) filters.ethAddr = walletEthAddress
      if (res.message !== undefined) {
        if (res.message.includes('insufficient funds')) {
          setState({ ...state, error: '1' })
          handleToggleModalError()
        }
      }
      if (res.res) {
        onStateDeposit(res, tokenId, config.operator, depositAmount)
      }
    }
  }

  function handleSetAmount (event) {
    setAmount(event.target.value)
  }

  function handleSetToken (_, { value }) {
    const tokenId = Number(value)

    setTokenId(tokenId)
  }

  function dropDownTokens () {
    const tokensOptions = tokensList
      .map((token) => ({
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
              <ButtonGM />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color='blue' onClick={handleClick} disabled={!isFormValid()}>
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
  metamaskWallet: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  config: state.general.config,
  abiRollup: state.general.abiRollup,
  metamaskWallet: state.general.metamaskWallet,
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
