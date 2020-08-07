import React from 'react'
import PropTypes from 'prop-types'
import {
  Table, Button, Icon
} from 'semantic-ui-react'
import ethers from 'ethers'

import ModalInfoId from './modal-info-id'
import ModalInfoIdExits from './modal-info-id-exits'

function InfoBabyjub ({
  tokensR,
  tokensE,
  txs,
  txsExits,
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
      return ethers.utils.formatEther(tokensR)
    }

    return <Icon name='circle notched' loading />
  }

  function isLoadingTokensE () {
    if (loading === false) {
      return ethers.utils.formatEther(tokensE)
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
            <ModalInfoId txs={txs} />
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
            <ModalInfoIdExits txsExits={txsExits} />
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
  babyjub: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired
}

InfoBabyjub.defaultProps = {
  tokensR: '0',
  tokensE: '0',
  txs: []
}

export default InfoBabyjub
