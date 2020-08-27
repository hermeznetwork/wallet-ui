import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Button, Modal, Form, Icon, Dropdown
} from 'semantic-ui-react'

import ModalError from '../modals-info/modal-error'
import ButtonGM from './gm-buttons'
// import { handleSendForceExit } from '../../../../../store/tx/actions'
// import { handleStateForceExit } from '../../../../../store/tx-state/actions'
// import { getWei } from '../../../../../utils/utils'

function ModalForceExit ({
  config,
  modalForceExit,
  onToggleModalForceExit,
  // onSendForceExit,
  // onStateForceExit,
  metamaskWallet,
  babyjub,
  tokensList,
  gasMultiplier
}) {
  const [amount, setAmount] = React.useState(0)
  const [tokenId, setTokenId] = React.useState()
  const [state, setState] = React.useState({
    modalError: false,
    sendDisabled: true,
    error: ''
  })

  function handleCloseModal () {
    onToggleModalForceExit()
    setState({
      ...state,
      amount: '',
      modalError: false,
      sendDisabled: true,
      error: '',
      tokenId: ''
    })
  }

  function handleToggleModalError () {
    setState({ ...state, modalError: !state.modalError })
  }

  function isFormValid () {
    return Boolean(parseInt(amount, 10) && (parseInt(tokenId, 10) || tokenId === 0))
  }

  function handleSetAmount (event) {
    setAmount(event.target.value)
  }

  function handleSetToken (_, { value }) {
    const tokenId = Number(value)

    setTokenId(tokenId)
  }

  async function handleClick () {
    // const amountWei = getWei(amount)

    handleCloseModal()

    // const res = await onSendForceExit(
    //   config.address,
    //   tokenId,
    //   amountWei,
    //   metamaskWallet,
    //   config.abiRollup,
    //   config.operator,
    //   gasMultiplier
    // )

    // if (res.message !== undefined) {
    //   if (res.message.includes('insufficient funds')) {
    //     setState({ ...state, error: '1' })
    //     handleToggleModalError()
    //   }
    // }
    // if (res.res) {
    //   onStateForceExit(res, config.operator, amount, amountWei)
    // }
  }

  function dropDownTokens () {
    const tokensOptions = tokensList.map((token) => ({
      key: token.tokenId,
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
      <Modal open={modalForceExit}>
        <Modal.Header>Force Exit</Modal.Header>
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
            </Form.Field>
            <Form.Field>
              <label htmlFor='amount'>
                Amount
                <input
                  type='text'
                  id='amount'
                  onChange={handleSetAmount}
                />
              </label>
            </Form.Field>
            <Form.Field>
              <label htmlFor='tokenid'>
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
            <Icon name='share' />
              Force Exit
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

ModalForceExit.propTypes = {
  config: PropTypes.object.isRequired,
  modalForceExit: PropTypes.bool.isRequired,
  onToggleModalForceExit: PropTypes.func.isRequired,
  onSendForceExit: PropTypes.func.isRequired,
  // onStateForceExit: PropTypes.func.isRequired,
  metamaskWallet: PropTypes.object.isRequired,
  babyjub: PropTypes.string.isRequired,
  tokensList: PropTypes.array.isRequired,
  gasMultiplier: PropTypes.number.isRequired
}

const mapStateToProps = (state) => ({
  config: state.general.config,
  metamaskWallet: state.general.metamaskWallet,
  gasMultiplier: state.general.gasMultiplier
})

export default connect(
  mapStateToProps,
  {
    // onSendForceExit: handleSendForceExit
    // onStateForceExit: handleStateForceExit
  }
)(ModalForceExit)
