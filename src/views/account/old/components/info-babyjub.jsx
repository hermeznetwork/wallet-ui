import React from 'react'
import PropTypes from 'prop-types'
import {
  Table, Button, Icon
} from 'semantic-ui-react'

import ModalInfoId from './modal-info-id'
import ModalInfoIdExits from './modal-info-id-exits'

const web3 = require('web3')

function InfoBabyjub ({
  tokensR,
  tokensE,
  txs,
  txsExits,
  noImported,
  babyjub,
  loading
}) {
  function importedWalletBabyJub () {
    if (babyjub === '0x0000000000000000000000000000000000000000') {
      return (
        <div>
          <Icon name='close' color='red' />
          You must import a wallet!
        </div>
      )
    }

    return babyjub
  }

  function isLoadingTokensR () {
    if (loading === false) {
      return web3.utils.fromWei(tokensR, 'ether')
    }

    return <Icon name='circle notched' loading />
  }

  function isLoadingTokensE () {
    if (loading === false) {
      return web3.utils.fromWei(tokensE, 'ether')
    }

    return <Icon name='circle notched' loading />
  }

  function handleCopyBabyJub () {
    const auxBaby = document.createElement('input')

    auxBaby.setAttribute('value', babyjub)
    document.body.appendChild(auxBaby)
    auxBaby.select()
    document.execCommand('copy')
    document.body.removeChild(auxBaby)
  }

  return (
    <Table attached fixed>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell rowSpan='3' textAlign='center' colSpan='1'>Rollup</Table.HeaderCell>
          <Table.Cell colSpan='2'><b>Rollup (BabyJubJub) Address:</b></Table.Cell>
          <Table.Cell colSpan='5'>
            {importedWalletBabyJub()}
          </Table.Cell>
          <Table.Cell colSpan='2' floated='left'>
            <Button
              icon='copy outline'
              circular
              size='large'
              onClick={handleCopyBabyJub}
              disabled={noImported}
            />
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell colSpan='2'>
            <b>TOKENS:</b>
          </Table.Cell>
          <Table.Cell colSpan='5'>
            {isLoadingTokensR()}
          </Table.Cell>
          <Table.Cell colSpan='2' floated='left'>
            <ModalInfoId txs={txs} noImported={noImported} />
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell colSpan='2'>
            <b>PENDING WITHDRAW TOKENS:</b>
          </Table.Cell>
          <Table.Cell colSpan='5'>
            {isLoadingTokensE()}
          </Table.Cell>
          <Table.Cell colSpan='2' floated='left'>
            <ModalInfoIdExits txsExits={txsExits} noImported={noImported} />
          </Table.Cell>
        </Table.Row>
      </Table.Header>
    </Table>
  )
}

InfoBabyjub.propTypes = {
  tokensR: PropTypes.string,
  tokensE: PropTypes.string,
  txs: PropTypes.array,
  txsExits: PropTypes.array,
  noImported: PropTypes.bool.isRequired,
  babyjub: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired
}

InfoBabyjub.defaultProps = {
  tokensR: '0',
  tokensE: '0',
  txs: []
}

export default InfoBabyjub
