import React from 'react'
import {
  Container, Icon, Card, Label, Menu, Header
} from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ModalInfoOffchain from '../modals-info/modal-info-offchain'
import ModalInfoOnchain from '../modals-info/modal-info-onchain'
import ModalInfoTx from '../modals-info/modal-info-txs'
import { pointToCompress } from '../../../../../utils/utils'

function InfoTx ({
  pendingOffchain,
  pendingOnchain,
  txTotal,
  currentBatch,
  metaMaskWallet
}) {
  const [keyItem, setKeyIem] = React.useState({})
  const [state, setState] = React.useState({
    modalInfoOnchain: false,
    modalInfoOffchain: false,
    modalInfoTx: false
  })
  const txTotalByAddress = txTotal.filter(
    (tx) => tx.from === metaMaskWallet.ethereumAddress ||
      tx.from === pointToCompress(metaMaskWallet.publicKey)
  )

  txTotalByAddress.sort((o1, o2) => {
    if (o1.timestamp > o2.timestamp) {
      return 1
    } if (o1.timestamp < o2.timestamp) {
      return -1
    }
    return 0
  })

  function toggleModalInfoOnchain () {
    setState({ ...state, modalInfoOnchain: !state.modalInfoOnchain })
  }

  function toggleModalInfoOffchain () {
    setState({ ...state, modalInfoOffchain: !state.modalInfoOffchain })
  }

  function toggleModalInfoTx () {
    setState({ ...state, modalInfoTx: !state.modalInfoTx })
  }

  function getInfoModalOnchain (event, keyItem) {
    event.preventDefault()
    setKeyIem(keyItem)
    toggleModalInfoOnchain()
  }

  function getInfoModalOffchain (event, keyItem) {
    event.preventDefault()
    setKeyIem(keyItem)
    toggleModalInfoOffchain()
  }

  function getInfoModalTx (event) {
    event.preventDefault()
    toggleModalInfoTx()
  }

  function getMessagePending () {
    if (pendingOffchain.length > 0 || pendingOnchain.length > 0) {
      return (
        <Container>
          <Header as='h3'>Pending Transactions:</Header>
        </Container>
      )
    }
  }

  function getPendingOffchain () {
    return pendingOffchain.map((key) => {
      return (
        <Card color='blue' key={key.id} onClick={(event) => getInfoModalOffchain(event, key)}>
          <Card.Content>
            <Card.Header>
              {key.type}
              :
              {' '}
              {key.amount}
              {' '}
              Tokens
            </Card.Header>
            <Card.Meta>Off-chain</Card.Meta>
          </Card.Content>
        </Card>
      )
    })
  }

  function getPendingOnchain () {
    return pendingOnchain.map((key, index) => {
      return (
        <Card color='violet' key={index} onClick={(event) => getInfoModalOnchain(event, key)}>
          <Card.Content>
            <Card.Header>
              {key.type}
              :
              {' '}
              {key.amount}
              {' '}
              Tokens
            </Card.Header>
            <Card.Meta>On-chain</Card.Meta>
          </Card.Content>
        </Card>
      )
    })
  }

  return (
    <Container>
      <Container textAlign='left'>
        <Card.Group>
          {getMessagePending()}
          {getPendingOffchain()}
          {getPendingOnchain()}
        </Card.Group>
      </Container>
      <Container textAlign='right'>
        <Menu compact>
          <Menu.Item as='a' onClick={(event) => getInfoModalTx(event)}>
            <Label color='blue' floating>{txTotalByAddress.length}</Label>
            <Icon name='time' color='blue' />
              History
          </Menu.Item>
        </Menu>
      </Container>
      <ModalInfoTx
        modalInfoTx={state.modalInfoTx}
        txTotal={txTotalByAddress}
        toggleModalInfoTx={toggleModalInfoTx}
        getInfoModalOnchain={getInfoModalOnchain}
        getInfoModalOffchain={getInfoModalOffchain}
      />
      <ModalInfoOffchain
        modalInfoOffchain={state.modalInfoOffchain}
        keyItem={keyItem}
        toggleModalInfoOffchain={toggleModalInfoOffchain}
        currentBatch={currentBatch}
      />
      <ModalInfoOnchain
        modalInfoOnchain={state.modalInfoOnchain}
        keyItem={keyItem}
        toggleModalInfoOnchain={toggleModalInfoOnchain}
        currentBatch={currentBatch}
      />
    </Container>
  )
}

InfoTx.propTypes = {
  pendingOffchain: PropTypes.array.isRequired,
  pendingOnchain: PropTypes.array.isRequired,
  txTotal: PropTypes.array.isRequired,
  currentBatch: PropTypes.number.isRequired,
  metaMaskWallet: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  pendingOffchain: state.txState.pendingOffchain,
  pendingOnchain: state.txState.pendingOnchain,
  txTotal: state.txState.txTotal,
  currentBatch: state.general.currentBatch
})

export default connect(mapStateToProps, { })(InfoTx)
