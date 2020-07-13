import React from 'react'
import PropTypes from 'prop-types'
import {
  Modal, Button
} from 'semantic-ui-react'

const message = {
  0: 'You do not have enough approved tokens.',
  1: 'You do not have enough ether.'
}

function ModalError ({
  modalError,
  error,
  onToggleModalError
}) {
  return (
    <Modal open={modalError}>
      <Modal.Header>Error</Modal.Header>
      <Modal.Content>
        {message[error]}
      </Modal.Content>
      <Modal.Actions>
        <Button color='red' onClick={onToggleModalError}>
            OK
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

ModalError.propTypes = {
  modalError: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  onToggleModalError: PropTypes.func.isRequired
}

export default ModalError
