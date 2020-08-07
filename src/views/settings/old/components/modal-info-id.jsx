import React from 'react'
import PropTypes from 'prop-types'
import ethers from 'ethers'
import {
  Table, Icon, Modal, Button
} from 'semantic-ui-react'

function ModalInfoId ({
  txs
}) {
  function getIdTokens () {
    try {
      return txs.map((key, index) => {
        return (
          <Table.Row key={index}>
            <Table.Cell>{key.coin}</Table.Cell>
            <Table.Cell>{ethers.utils.formatEther(key.amount)}</Table.Cell>
          </Table.Row>
        )
      })
    } catch (err) {
      return (
        <Table.Row>
          <Table.Cell>0</Table.Cell>
          <Table.Cell>0</Table.Cell>
        </Table.Row>
      )
    }
  }

  return (
    <Modal trigger={<Button icon='info' content='More Information...' />} closeIcon>
      <Modal.Header><Icon name='info' /></Modal.Header>
      <Modal.Content>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>COIN</Table.HeaderCell>
              <Table.HeaderCell>TOKENS</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {getIdTokens()}
          </Table.Body>
        </Table>
      </Modal.Content>
    </Modal>
  )
}

ModalInfoId.propTypes = {
  txs: PropTypes.array
}

ModalInfoId.defaultProps = {
  txs: [{ coin: 0, amount: 0 }]
}

export default ModalInfoId
