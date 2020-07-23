import React from 'react'
import PropTypes from 'prop-types'
import {
  Table, Button, Icon
} from 'semantic-ui-react'

import ModalInfoId from './modal-info-id'

const web3 = require('web3')

function InfoEthereum ({
  tokens,
  tokensArray,
  tokensAArray,
  tokensA,
  balance,
  noImported,
  address,
  loading
}) {
  function importedWallet () {
    if (address === '0x0000000000000000000000000000000000000000') {
      return (
        <div>
          <Icon name='close' color='red' />
          You must import a wallet!
        </div>
      )
    }

    return address
  }

  function isLoadingTokens () {
    if (loading === false) {
      return web3.utils.fromWei(tokens, 'ether')
    }

    return <Icon name='circle notched' loading />
  }

  function isLoadingTokensA () {
    if (loading === false) {
      return web3.utils.fromWei(tokensA, 'ether')
    }

    return <Icon name='circle notched' loading />
  }

  function isLoadingEthers () {
    if (loading === false) {
      return balance
    }

    return <Icon name='circle notched' loading />
  }

  function handleCopyAddress () {
    const aux = document.createElement('input')

    aux.setAttribute('value', address)
    document.body.appendChild(aux)
    aux.select()
    document.execCommand('copy')
    document.body.removeChild(aux)
  }

  return (
    <Table attached fixed>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell rowSpan='4' textAlign='center' colSpan='1'>Ethereum</Table.HeaderCell>
          <Table.Cell colSpan='2'><b>Ethereum Address:</b></Table.Cell>
          <Table.Cell colSpan='5'>
            {importedWallet()}
          </Table.Cell>
          <Table.Cell colSpan='2' floated='left'>
            <Button
              icon='copy outline'
              circular
              size='large'
              onClick={handleCopyAddress}
              disabled={noImported}
            />
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell colSpan='2'>
            <b>ETH:</b>
          </Table.Cell>
          <Table.Cell colSpan='7'>
            {isLoadingEthers()}
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell colSpan='2'>
            <b>TOKENS:</b>
          </Table.Cell>
          <Table.Cell colSpan='5'>
            {isLoadingTokens()}
          </Table.Cell>
          <Table.Cell colSpan='2' floated='left'>
            <ModalInfoId txs={tokensArray} noImported={noImported} />
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell colSpan='2'>
            <b>APPROVED TOKENS:</b>
          </Table.Cell>
          <Table.Cell colSpan='5'>
            {isLoadingTokensA()}
          </Table.Cell>
          <Table.Cell colSpan='2' floated='left'>
            <ModalInfoId txs={tokensAArray} noImported={noImported} />
          </Table.Cell>
        </Table.Row>
      </Table.Header>
    </Table>
  )
}

InfoEthereum.propTypes = {
  tokens: PropTypes.string,
  tokensArray: PropTypes.array,
  tokensAArray: PropTypes.array,
  tokensA: PropTypes.string,
  balance: PropTypes.string,
  noImported: PropTypes.bool.isRequired,
  address: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired
}

InfoEthereum.defaultProps = {
  tokens: '0',
  balance: '0',
  tokensArray: [],
  tokensAArray: []
}

export default InfoEthereum
