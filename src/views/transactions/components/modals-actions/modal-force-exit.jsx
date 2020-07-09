import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Button, Modal, Form, Icon, Dropdown
} from 'semantic-ui-react'
import ModalError from '../modals-info/modal-error'
import ButtonGM from './gm-buttons'
import { handleSendForceExit } from '../../../../store/tx/actions'
import { handleStateForceExit } from '../../../../store/tx-state/actions'
import { getWei } from '../../../../utils/utils'

class ModalForceExit extends Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    modalForceExit: PropTypes.bool.isRequired,
    onToggleModalForceExit: PropTypes.func.isRequired,
    onSendForceExit: PropTypes.func.isRequired,
    onStateForceExit: PropTypes.func.isRequired,
    desWallet: PropTypes.object.isRequired,
    babyjub: PropTypes.string.isRequired,
    tokensList: PropTypes.array.isRequired,
    gasMultiplier: PropTypes.number.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      amount: '',
      modalError: false,
      sendDisabled: true,
      error: '',
      tokenId: ''
    }
  }

  handleCloseModal = () => {
    this.props.onToggleModalForceExit()
    this.setState({
      amount: '',
      modalError: false,
      sendDisabled: true,
      error: '',
      tokenId: ''
    })
  }

  handleToggleModalError = () => { this.setState((prev) => ({ modalError: !prev.modalError })) }

  checkForm = () => {
    const {
      amount, tokenId
    } = this.state
    if (parseInt(amount, 10) && (parseInt(tokenId, 10) || tokenId === 0)) {
      this.setState({ sendDisabled: false })
    } else {
      this.setState({ sendDisabled: true })
    }
  }

  handleSetAmount = (event) => {
    this.setState({ amount: event.target.value }, () => { this.checkForm() })
  }

  handleSetToken = (event, { value }) => {
    const tokenId = Number(value)
    this.setState({ tokenId }, () => { this.checkForm() })
  }

  handleClick = async () => {
    const { config, desWallet, gasMultiplier } = this.props
    const amountWei = getWei(this.state.amount)
    const tokenId = this.state.tokenId
    this.handleCloseModal()
    const res = await this.props.onSendForceExit(config.nodeEth, config.address, tokenId, amountWei, desWallet,
      config.abiRollup, config.operator, gasMultiplier)
    if (res.message !== undefined) {
      if (res.message.includes('insufficient funds')) {
        this.setState({ error: '1' })
        this.handleToggleModalError()
      }
    }
    if (res.res) {
      this.props.onStateForceExit(res, config.operator, tokenId, amountWei)
    }
  }

  dropDownTokens = () => {
    const tokensOptions = []
    for (const token in this.props.tokensList) {
      tokensOptions.push({
        key: this.props.tokensList[token].address,
        value: this.props.tokensList[token].tokenId,
        text: `${this.props.tokensList[token].tokenId}: ${this.props.tokensList[token].address}`
      })
    }
    return (
      <Dropdown
        placeholder='token'
        options={tokensOptions}
        onChange={this.handleSetToken}
        scrolling
      />
    )
  }

  modal = () => {
    return (
      <Modal open={this.props.modalForceExit}>
        <Modal.Header>Force Exit</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <label htmlFor='babyjub-from'>
                Sender BabyJubJub Address
                <input
                  type='text'
                  defaultValue={this.props.babyjub}
                  id='baby-ax-s'
                  disabled
                />
              </label>
            </Form.Field>
            <Form.Field>
              <label htmlFor='amount'>
                Amount
                <input
                  type='text'
                  id='amount'
                  onChange={this.handleSetAmount}
                />
              </label>
            </Form.Field>
            <Form.Field>
              <label htmlFor='tokenid'>
                Token ID
              </label>
              {this.dropDownTokens()}
            </Form.Field>
            <Form.Field>
              <ButtonGM />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color='blue' onClick={this.handleClick} disabled={this.state.sendDisabled}>
            <Icon name='share' />
              Force Exit
          </Button>
          <Button color='grey' basic onClick={this.handleCloseModal}>
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
  desWallet: state.general.desWallet,
  gasMultiplier: state.general.gasMultiplier
})

export default connect(
  mapStateToProps,
  {
    onSendForceExit: handleSendForceExit,
    onStateForceExit: handleStateForceExit
  }
)(ModalForceExit)
