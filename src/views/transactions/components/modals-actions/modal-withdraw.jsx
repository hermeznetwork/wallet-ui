import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Button, Modal, Form, Icon, Dropdown
} from 'semantic-ui-react'
import ModalError from '../modals-info/modal-error'
import ButtonGM from './gm-buttons'
import { handleSendWithdraw } from '../../../../store/tx/actions'
import { handleStateWithdraw } from '../../../../store/tx-state/actions'

class ModalWithdraw extends Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    abiRollup: PropTypes.array.isRequired,
    modalWithdraw: PropTypes.bool.isRequired,
    onToggleModalWithdraw: PropTypes.func.isRequired,
    handleSendWithdraw: PropTypes.func.isRequired,
    handleStateWithdraw: PropTypes.func.isRequired,
    gasMultiplier: PropTypes.number.isRequired,
    desWallet: PropTypes.object.isRequired,
    txsExits: PropTypes.array
  };

  constructor (props) {
    super(props)
    this.state = {
      exitRoots: [],
      numExitRoot: -1,
      tokenId: -1,
      initModal: true,
      modalError: false,
      nextDisabled: true,
      sendDisabled: true,
      error: ''
    }
    this.idFromRef = React.createRef()
  }

  handleToggleModalError = () => { this.setState((prev) => ({ modalError: !prev.modalError })) }

  handleToggleModalChange = () => {
    if (this.state.initModal === true) {
      this.setState({ initModal: false })
    } else {
      this.setState({ initModal: true, nextDisabled: true, sendDisabled: true })
    }
  }

  handleToggleCloseModal = () => { this.handleToggleModalChange(); this.props.onToggleModalWithdraw() }

  handleClick = async () => {
    const {
      config, abiRollup, desWallet, gasMultiplier
    } = this.props

    const tokenId = Number(this.state.tokenId)
    const numExitRoot = Number(this.state.numExitRoot)
    const { nodeEth } = config
    const addressSC = config.address
    const { operator } = config
    this.handleToggleModalChange()
    this.props.onToggleModalWithdraw()
    const res = await this.props.handleSendWithdraw(nodeEth, addressSC, tokenId, desWallet,
      abiRollup, operator, numExitRoot, gasMultiplier)
    if (res !== undefined) {
      if (res.message !== undefined) {
        if (res.message.includes('insufficient funds')) {
          this.setState({ error: '1' })
          this.handleToggleModalError()
        }
      }
      if (res.res) {
        this.props.handleStateWithdraw(res, tokenId)
      }
    }
  }

  handleGetExitRoot = async () => {
    const { txsExits } = this.props
    const txsExitsById = txsExits.filter((tx) => tx.coin === this.state.tokenId)
    const exitRoots = []
    txsExitsById.map(async (key, index) => {
      exitRoots.push({
        key: index, value: key.batch, text: `Batch: ${key.batch} Amount: ${key.amount}`
      })
    })
    this.setState({ exitRoots }, () => { this.handleToggleModalChange() })
  }

  idsExit = () => {
    const { txsExits } = this.props
    const infoTxsExits = []
    for (const i in txsExits) {
      if ({}.hasOwnProperty.call(txsExits, i)) {
        const tx = txsExits[i]
        if (!infoTxsExits.find((info) => info.value === tx.coin)) {
          infoTxsExits.push({
            key: i, value: tx.coin, text: tx.coin
          })
        }
      }
    }
    let dropdown
    if (infoTxsExits.length === 0) {
      dropdown = (<Dropdown placeholder='ID' />)
    } else {
      dropdown = (
        <Dropdown
          scrolling
          placeholder='ID'
          options={infoTxsExits}
          onChange={this.handleChangeIdFrom}
        />
      )
    }
    return dropdown
  }

  handleChangeIdFrom = (e, { value }) => this.setState({ tokenId: value, nextDisabled: false });

  exitRoot = () => {
    let dropdown
    if (this.state.exitRoots.length === 0) {
      dropdown = (<Dropdown placeholder='Batch and Amount' />)
    } else {
      dropdown = (
        <Dropdown
          scrolling
          placeholder='Batch and Amount'
          options={this.state.exitRoots}
          onChange={this.handleChange}
        />
      )
    }
    return dropdown
  }

  handleChange = (e, { value }) => this.setState({ numExitRoot: value, sendDisabled: false })

  modal = () => {
    if (this.state.initModal === true) {
      return (
        <Modal open={this.props.modalWithdraw}>
          <Modal.Header>Withdraw</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Field>
                <p><b>Coin</b></p>
                {this.idsExit()}
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color='blue' onClick={this.handleGetExitRoot} disabled={this.state.nextDisabled}>
              <Icon name='arrow right' />
              Next
            </Button>
            <Button color='grey' basic onClick={this.props.onToggleModalWithdraw}>
              <Icon name='close' />
              Close
            </Button>
          </Modal.Actions>
        </Modal>
      )
    }
    return (
      <Modal open={this.props.modalWithdraw}>
        <Modal.Header>Withdraw</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <p><b>Coin</b></p>
              <p>{this.state.tokenId}</p>
            </Form.Field>
            <Form.Field>
              <p><b>Batch and Amount</b></p>
              {this.exitRoot()}
            </Form.Field>
            <Form.Field>
              <ButtonGM />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color='blue' onClick={this.handleToggleModalChange}>
            <Icon name='arrow left' />
            Previous
          </Button>
          <Button color='blue' onClick={this.handleClick} disabled={this.state.sendDisabled}>
            <Icon name='sign-out' />
            Withdraw
          </Button>
          <Button color='grey' basic onClick={this.handleToggleCloseModal}>
            <Icon name='close' />
            Close
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }

  render () {
    return (
      <div>
        <ModalError
          error={this.state.error}
          modalError={this.state.modalError}
          onToggleModalError={this.handleToggleModalError}
        />
        {this.modal()}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  config: state.general.config,
  abiRollup: state.general.abiRollup,
  desWallet: state.general.desWallet,
  txsExits: state.general.txsExits,
  gasMultiplier: state.general.gasMultiplier
})

export default connect(mapStateToProps, { handleSendWithdraw, handleStateWithdraw })(ModalWithdraw)
