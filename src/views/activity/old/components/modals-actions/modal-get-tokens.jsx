import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Button, Modal, Form, Icon
} from 'semantic-ui-react'

import ModalError from '../modals-info/modal-error'
import ButtonGM from './gm-buttons'
import { handleGetTokens } from '../../../../../store/tx/actions'

function ModalGetTokens ({
  config,
  desWallet,
  modalGetTokens,
  onToggleModalGetTokens,
  onGetTokens
}) {
  const [state, setState] = React.useState({
    modalError: false,
    error: ''
  })

  function handleToggleModalError () {
    setState({ ...state, modalError: !state.modalError })
  }

  async function handleClickGetTokens () {
    onToggleModalGetTokens()

    const res = await onGetTokens(config.nodeEth, config.tokensAddress, desWallet)

    if (res.message !== undefined) {
      if (res.message.includes('insufficient funds')) {
        setState({ ...state, error: '1' })
        handleToggleModalError()
      }
    }
  }

  return (
    <div>
      <ModalError
        error={state.error}
        modalError={state.modalError}
        onToggleModalError={handleToggleModalError}
      />
      <Modal open={modalGetTokens}>
        <Modal.Header>Get Tokens</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <b>
                  Amount Tokens:
              </b>
              <p>1000</p>
            </Form.Field>
            <Form.Field>
              <label htmlFor='addressTokens'>
                  Address SC Tokens:
                <input
                  type='text'
                  disabled
                  placeholder='0x0000000000000000000000000000000000000000'
                  defaultValue={config.tokensAddress}
                  size='40'
                />
              </label>
            </Form.Field>
            <Form.Field>
              <ButtonGM />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={handleClickGetTokens} color='blue'>
            <Icon name='ethereum' />
              GET TOKENS
          </Button>
          <Button color='grey' basic onClick={onToggleModalGetTokens}>
            <Icon name='close' />
              Close
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  )
}

ModalGetTokens.propTypes = {
  config: PropTypes.object.isRequired,
  desWallet: PropTypes.object.isRequired,
  modalGetTokens: PropTypes.bool.isRequired,
  onToggleModalGetTokens: PropTypes.func.isRequired,
  onGetTokens: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  config: state.general.config,
  desWallet: state.general.desWallet,
  gasMultiplier: state.general.gasMultiplier
})

export default connect(mapStateToProps, { onGetTokens: handleGetTokens })(ModalGetTokens)
