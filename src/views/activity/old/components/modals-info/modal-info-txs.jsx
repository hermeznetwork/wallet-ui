import React from 'react'
import PropTypes from 'prop-types'
import {
  Button, Modal, Table
} from 'semantic-ui-react'

function ModalInfoTx ({
  modalInfoTx,
  txTotal,
  toggleModalInfoTx,
  getInfoModalOnchain,
  getInfoModalOffchain
}) {
  function handleClick () {
    toggleModalInfoTx()
  }

  function getModalContent () {
    try {
      return txTotal.map((key, index) => {
        let state

        if (key.state && key.state.includes('Success')) {
          state = <Table.Cell positive>{key.state}</Table.Cell>
        } else if (key.state === 'Error') {
          state = <Table.Cell negative>{key.state}</Table.Cell>
        } else {
          state = <Table.Cell>{key.state}</Table.Cell>
        }

        let buttonInfo

        if (key.type === 'Deposit' || key.type === 'Withdraw' || key.type === 'ForceExit') {
          buttonInfo = (
            <Table.Cell>
              <Button key={index} onClick={(event) => getInfoModalOnchain(event, key)}>
                Info
              </Button>
            </Table.Cell>
          )
        } else if (key.type === 'Send' || key.type === 'Exit') {
          buttonInfo = (
            <Table.Cell>
              <Button key={index} onClick={(event) => getInfoModalOffchain(event, key)}>
                Info
              </Button>
            </Table.Cell>
          )
        }

        return (
          <Table.Row key={index}>
            <Table.Cell>{key.type}</Table.Cell>
            <Table.Cell>{key.amount}</Table.Cell>
            {state}
            {buttonInfo}
          </Table.Row>
        )
      })
    } catch (err) {
      return ('')
    }
  }

  return (
    <div>
      <Modal open={modalInfoTx}>
        <Modal.Header>Transactions History</Modal.Header>
        <Modal.Content>
          <Table fixed>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Transaction Type</Table.HeaderCell>
                <Table.HeaderCell>Transaction Amount</Table.HeaderCell>
                <Table.HeaderCell>State</Table.HeaderCell>
                <Table.HeaderCell>Info</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {getModalContent()}
            </Table.Body>
          </Table>
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

ModalInfoTx.propTypes = {
  modalInfoTx: PropTypes.bool.isRequired,
  txTotal: PropTypes.array.isRequired,
  toggleModalInfoTx: PropTypes.func.isRequired,
  getInfoModalOnchain: PropTypes.func.isRequired,
  getInfoModalOffchain: PropTypes.func.isRequired
}

export default ModalInfoTx
