import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Header, Container, Divider } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'

import { pointToCompress } from '../../../utils/utils'
import MenuActions from './components/actions/menu-actions'
import MenuBack from './components/information/menu'
import InfoWallet from '../../settings/old/components/info-wallet'
import InfoTx from './components/information/info-tx'
import MessageTx from './components/information/message-tx'
import ModalError from './components/modals-info/modal-error'
import ModalDeposit from './components/modals-actions/modal-deposit'
import ModalWithdraw from './components/modals-actions/modal-withdraw'
import ModalSend from './components/modals-actions/modal-send'
import ModalApprove from './components/modals-actions/modal-approve'
import ModalGetTokens from './components/modals-actions/modal-get-tokens'
import ModalForceExit from './components/modals-actions/modal-force-exit'

class ActionView extends Component {
  static propTypes = {
    metamaskWallet: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
    abiTokens: PropTypes.array.isRequired,
    tokens: PropTypes.string,
    tokensList: PropTypes.array.isRequired,
    tokensArray: PropTypes.array,
    tokensR: PropTypes.string,
    tokensA: PropTypes.string,
    tokensAArray: PropTypes.array,
    tokensE: PropTypes.string,
    tokensTotal: PropTypes.string,
    balance: PropTypes.string,
    txs: PropTypes.array,
    txsExits: PropTypes.array,
    apiOperator: PropTypes.object.isRequired,
    isLoadingInfoAccount: PropTypes.bool.isRequired,
    errorConfig: PropTypes.string.isRequired,
    txTotal: PropTypes.array.isRequired
  }

  static defaultProps = {
    tokens: '0',
    tokensR: '0',
    tokensE: '0',
    balance: '0',
    txs: [],
    txsExits: [],
    tokensArray: [],
    tokensAArray: []
  }

  constructor (props) {
    super(props)
    this.state = {
      modalDeposit: false,
      modalWithdraw: false,
      modalForceExit: false,
      modalSend: false,
      modalApprove: false,
      modalGetTokens: false,
      modalError: false,
      error: '',
      activeItem: '',
      babyjub: '0x0000000000000000000000000000000000000000',
      lengthTx: 0
    }
  }

  componentDidMount = async () => {
    if (Object.keys(this.props.metamaskWallet).length) {
      this.setState({
        babyjub: pointToCompress(this.props.metamaskWallet.publicKey),
        lengthTx: this.props.txTotal.length
      })
    }
  }

  componentDidUpdate = () => {
    if (this.props.txTotal.length > this.state.lengthTx) {
      this.setState({ lengthTx: this.props.txTotal.length })
    }
  }

  changeNode = async (currentNode) => {
    const { config } = this.props
    localStorage.clear()
    config.nodeEth = currentNode
  }

  handleItemClick = (e, { name }) => {
    e.preventDefault()
    this.setState({ activeItem: name })
    if (name === 'deposit') {
      this.setState({ modalDeposit: true })
    } else if (name === 'withdraw') {
      this.setState({ modalWithdraw: true })
    } else if (name === 'send' || name === 'send0') {
      this.setState({ modalSend: true })
    } else if (name === 'approve') {
      this.setState({ modalApprove: true })
    } else if (name === 'getTokens') {
      this.setState({ modalGetTokens: true })
    } else if (name === 'forcexit') {
      this.setState({ modalForceExit: true })
    }
  }

  handleToggleModalDeposit = () => { this.setState((prev) => ({ modalDeposit: !prev.modalDeposit })) }

  handleToggleModalWithdraw = () => { this.setState((prev) => ({ modalWithdraw: !prev.modalWithdraw })) }

  handleToggleModalForceExit = () => { this.setState((prev) => ({ modalForceExit: !prev.modalForceExit })) }

  handleToggleModalSend = () => { this.setState((prev) => ({ modalSend: !prev.modalSend })) }

  handleToggleModalApprove = () => { this.setState((prev) => ({ modalApprove: !prev.modalApprove })) }

  handleToggleModalGetTokens = () => { this.setState((prev) => ({ modalGetTokens: !prev.modalGetTokens })) }

  handleToggleModalError = () => { this.setState((prev) => ({ modalError: !prev.modalError })) }

  redirectInitView = () => {
    if (Object.keys(this.props.metamaskWallet).length === 0) {
      return <Redirect to='/old' />
    }
  }

  render () {
    return (
      <Container textAlign='center'>
        <MenuBack
          config={this.props.config}
          changeNode={this.changeNode}
          isLoadingInfoAccount={this.props.isLoadingInfoAccount}
        />
        <Header
          as='h1'
          style={{
            fontSize: '4em',
            fontWeight: 'normal',
            marginBottom: 0,
            marginTop: '1em'
          }}
        >
          Rollup Wallet
        </Header>
        <Divider />
        <MenuActions
          onItemClick={this.handleItemClick}
        />
        <MessageTx />
        <InfoWallet
          metamaskWallet={this.props.metamaskWallet}
          balance={this.props.balance}
          tokens={this.props.tokens}
          tokensR={this.props.tokensR}
          tokensE={this.props.tokensE}
          tokensA={this.props.tokensA}
          tokensArray={this.props.tokensArray}
          tokensAArray={this.props.tokensAArray}
          tokensTotal={this.props.tokensTotal}
          isLoadingInfoAccount={this.props.isLoadingInfoAccount}
          getInfoAccount={this.getInfoAccount}
          txs={this.props.txs}
          txsExits={this.props.txsExits}
        />
        <br />
        <InfoTx
          metamaskWallet={this.props.metamaskWallet}
        />
        <ModalDeposit
          balance={this.props.balance}
          tokensList={this.props.tokensList}
          tokensA={this.props.tokensA}
          modalDeposit={this.state.modalDeposit}
          onToggleModalDeposit={this.handleToggleModalDeposit}
        />
        <ModalWithdraw
          metamaskWallet={this.props.metamaskWallet}
          modalWithdraw={this.state.modalWithdraw}
          onToggleModalWithdraw={this.handleToggleModalWithdraw}
        />
        <ModalForceExit
          tokensList={this.props.tokensList}
          metamaskWallet={this.props.metamaskWallet}
          babyjub={this.state.babyjub}
          modalForceExit={this.state.modalForceExit}
          onToggleModalForceExit={this.handleToggleModalForceExit}
        />
        <ModalSend
          tokensRArray={this.props.tokensRArray}
          babyjub={this.state.babyjub}
          apiOperator={this.props.apiOperator}
          modalSend={this.state.modalSend}
          onToggleModalSend={this.handleToggleModalSend}
          activeItem={this.state.activeItem}
        />
        <ModalApprove
          balance={this.props.balance}
          modalApprove={this.state.modalApprove}
          onToggleModalApprove={this.handleToggleModalApprove}
          tokensA={this.props.tokensA}
        />
        <ModalGetTokens
          balance={this.props.balance}
          modalGetTokens={this.state.modalGetTokens}
          onToggleModalGetTokens={this.handleToggleModalGetTokens}
        />
        <ModalError
          error={this.state.error}
          modalError={this.state.modalError}
          onToggleModalError={this.handleToggleModalError}
        />
        {this.redirectInitView()}
        <br />
      </Container>
    )
  }
}

const mapStateToProps = (state) => ({
  metamaskWallet: state.general.metamaskWallet,
  apiOperator: state.general.apiOperator,
  abiTokens: state.general.abiTokens,
  config: state.general.config,
  password: state.general.password,
  balance: state.general.balance,
  tokensList: state.general.tokensList,
  tokens: state.general.tokens,
  tokensArray: state.general.tokensArray,
  tokensR: state.general.tokensR,
  tokensA: state.general.tokensA,
  tokensAArray: state.general.tokensAArray,
  tokensRArray: state.general.tokensRArray,
  tokensE: state.general.tokensE,
  tokensTotal: state.general.tokensTotal,
  txs: state.general.txs,
  txsExits: state.general.txsExits,
  isLoadingInfoAccount: state.general.isLoadingInfoAccount,
  errorConfig: state.general.errorConfig,
  txTotal: state.txState.txTotal
})

export default connect(mapStateToProps)(ActionView)
