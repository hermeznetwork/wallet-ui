import React from 'react'
import PropTypes from 'prop-types'
import {
  Button, Modal, Table
} from 'semantic-ui-react'

function ModalInfoOffchain ({
  modalInfoOffchain,
  keyItem,
  toggleModalInfoOffchain,
  currentBatch
}) {
  function handleClick () {
    toggleModalInfoOffchain()
  }

  function getReceiver () {
    if (keyItem.type === 'Send') {
      return (
        <Table.Row>
          <Table.Cell>
            Receiver:
          </Table.Cell>
          <Table.Cell>
            {keyItem.receiver}
          </Table.Cell>
        </Table.Row>
      )
    }
  }

  function getCurrentBatch () {
    if (keyItem.state && keyItem.state.includes('Pending')) {
      return (
        <Table.Row>
          <Table.Cell>
            Current Batch:
          </Table.Cell>
          <Table.Cell>
            {currentBatch}
          </Table.Cell>
        </Table.Row>
      )
    }
  }

  function getMaxBatch () {
    if (keyItem.state && keyItem.state.includes('Pending')) {
      return (
        <Table.Row>
          <Table.Cell>
            Estimated Finality Batch:
          </Table.Cell>
          <Table.Cell>
            {keyItem.maxNumBatch}
          </Table.Cell>
        </Table.Row>
      )
    }
  }

  function getForgedBatch () {
    if (keyItem.state && keyItem.state.includes('Success')) {
      return (
        <Table.Row>
          <Table.Cell>
            Forged at Batch:
          </Table.Cell>
          <Table.Cell>
            {keyItem.finalBatch}
          </Table.Cell>
        </Table.Row>
      )
    }
  }

  function getConfirmationBatch () {
    if (keyItem.state && keyItem.state.includes('Success') && keyItem.state.includes('pending')) {
      const maxCurrentBatch = Math.max(currentBatch, keyItem.currentBatch)

      return (
        <Table.Row>
          <Table.Cell>
            Confirmation Batches:
          </Table.Cell>
          <Table.Cell>
            {maxCurrentBatch - keyItem.finalBatch}
          </Table.Cell>
        </Table.Row>
      )
    } if (keyItem.state && keyItem.state.includes('Success') && !keyItem.state.includes('pending')) {
      return (
        <Table.Row>
          <Table.Cell>
            Confirmation Batches:
          </Table.Cell>
          <Table.Cell>
            5+
          </Table.Cell>
        </Table.Row>
      )
    }
  }

  function getError () {
    if (keyItem.error && keyItem.state.includes('Error')) {
      return (
        <Table.Row>
          <Table.Cell>
            Error:
          </Table.Cell>
          <Table.Cell>
            {keyItem.error}
          </Table.Cell>
        </Table.Row>
      )
    }
  }

  function getModalContent () {
    if (keyItem) {
      let state

      if (keyItem.state && keyItem.state.includes('Success')) {
        state = <Table.Cell positive>{keyItem.state}</Table.Cell>
      } else if (keyItem.state === 'Error') {
        state = <Table.Cell negative>{keyItem.state}</Table.Cell>
      } else if (keyItem.state === 'Pending') {
        state = <Table.Cell warning>{keyItem.state}</Table.Cell>
      } else {
        state = <Table.Cell>{keyItem.state}</Table.Cell>
      }

      return (
        <Table>
          <Table.Body>
            <Table.Row>
              <Table.Cell>
                Type:
              </Table.Cell>
              <Table.Cell>
                {keyItem.type}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                Amount:
              </Table.Cell>
              <Table.Cell>
                {keyItem.amount}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                Fee:
              </Table.Cell>
              <Table.Cell>
                {keyItem.fee}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                Token ID:
              </Table.Cell>
              <Table.Cell>
                {keyItem.tokenId}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                State:
              </Table.Cell>
              {state}
            </Table.Row>
            {getReceiver()}
            {getForgedBatch()}
            {getCurrentBatch()}
            {getMaxBatch()}
            {getConfirmationBatch()}
            {getError()}
          </Table.Body>
        </Table>
      )
    }
  }

  return (
    <div>
      <Modal open={modalInfoOffchain}>
        <Modal.Header>Transaction Information</Modal.Header>
        <Modal.Content>
          {getModalContent()}
        </Modal.Content>
        <Modal.Actions>
          <Button color='blue' onClick={handleClick}>
              OK
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  )
}

ModalInfoOffchain.propTypes = {
  modalInfoOffchain: PropTypes.bool.isRequired,
  keyItem: PropTypes.object.isRequired,
  toggleModalInfoOffchain: PropTypes.func.isRequired,
  currentBatch: PropTypes.number.isRequired
}

export default ModalInfoOffchain
