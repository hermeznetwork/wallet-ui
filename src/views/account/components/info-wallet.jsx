import React from 'react'
import PropTypes from 'prop-types'
import {
  Table, Button, Container, Icon
} from 'semantic-ui-react'

import InfoEtherum from './info-ethereum'
import InfoBabyjub from './info-babyjub'

import { pointToCompress } from '../../../utils/utils'

const web3 = require('web3')

function InfoWallet ({
  desWallet,
  isLoadingInfoAccount,
  tokens,
  tokensR,
  tokensE,
  tokensA,
  tokensArray,
  tokensAArray,
  tokensTotal,
  balance,
  txs,
  txsExits,
  getInfoAccount,
  noImported
}) {
  const [state, setState] = React.useState({
    address: '0x0000000000000000000000000000000000000000',
    babyjub: '0x0000000000000000000000000000000000000000',
    loading: false
  })

  React.useEffect(() => {
    try {
      if (Object.keys(desWallet).length !== 0) {
        let address

        if (desWallet.ethWallet.address.startsWith('0x')) {
          address = desWallet.ethWallet.address
        } else {
          address = `0x${desWallet.ethWallet.address}`
        }

        if (state.address !== address) {
          const babyjub = pointToCompress(desWallet.babyjubWallet.publicKey)

          setState({ ...state, address, babyjub })
        }
      }
    } catch (e) {
      setState({
        ...state,
        address: '0x0000000000000000000000000000000000000000',
        babyjub: '0x0000000000000000000000000000000000000000'
      })
    }
  }, [desWallet, state, setState])

  React.useEffect(() => {
    if (isLoadingInfoAccount === true) {
      setState({ ...state, loading: true })
    } else {
      setState({ ...state, loading: false })
    }
  }, [isLoadingInfoAccount, state, setState])

  function handleReload () {
    setState({ ...state, loading: true })
    getInfoAccount()
  }

  function isLoadingTokensTotal () {
    if (state.loading === false) {
      return web3.utils.fromWei(tokensTotal, 'ether')
    }

    return <Icon name='circle notched' loading />
  }

  return (
    <Container>
      <Table attached color='blue' inverted fixed>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell colSpan='6' textAlign='center'>INFORMATION</Table.HeaderCell>
            <Table.HeaderCell textAlign='right'>
              <Button onClick={handleReload} disabled={noImported}>
                <Icon name='sync' color='blue' />
                  Reload
              </Button>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
      </Table>
      <InfoEtherum
        address={state.address}
        tokens={tokens}
        tokensA={tokensA}
        tokensArray={tokensArray}
        tokensAArray={tokensAArray}
        balance={balance}
        noImported={noImported}
        loading={state.loading}
      />
      <InfoBabyjub
        babyjub={state.babyjub}
        tokensR={tokensR}
        tokensE={tokensE}
        txs={txs}
        txsExits={txsExits}
        noImported={noImported}
        loading={state.loading}
      />
      <Table attached fixed>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign='center' colSpan='1'>Total</Table.HeaderCell>
            <Table.Cell colSpan='2'><b>TOKENS:</b></Table.Cell>
            <Table.Cell colSpan='7'>
              {isLoadingTokensTotal()}
            </Table.Cell>
          </Table.Row>
        </Table.Header>
      </Table>
      <br />
    </Container>
  )
}

InfoWallet.propTypes = {
  desWallet: PropTypes.object.isRequired,
  isLoadingInfoAccount: PropTypes.bool.isRequired,
  tokens: PropTypes.string,
  tokensR: PropTypes.string,
  tokensE: PropTypes.string,
  tokensA: PropTypes.string,
  tokensArray: PropTypes.array,
  tokensAArray: PropTypes.array,
  tokensTotal: PropTypes.string,
  balance: PropTypes.string,
  txs: PropTypes.array,
  txsExits: PropTypes.array,
  getInfoAccount: PropTypes.func.isRequired,
  noImported: PropTypes.bool.isRequired
}

InfoWallet.defaultProps = {
  tokens: '0',
  tokensR: '0',
  tokensE: '0',
  tokensTotal: '0',
  balance: '0',
  txs: [],
  tokensArray: [],
  tokensAArray: []
}

export default InfoWallet
