import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Header, Container, Divider } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'

import { handleGetTokens, handleApprove, handleInitStateTx } from '../../store/tx/actions'
import { handleInfoAccount, handleLoadFiles, getCurrentBatch } from '../../store/general/actions'
import { pointToCompress } from '../../utils/utils'
import MenuActions from './components/actions/menu-actions'
import MenuBack from './components/information/menu'
import InfoWallet from '../account/components/info-wallet'
import InfoTx from './components/information/info-tx'
import MessageTx from './components/information/message-tx'
import ModalError from './components/modals-info/modal-error'
import ModalDeposit from './components/modals-actions/modal-deposit'
import ModalWithdraw from './components/modals-actions/modal-withdraw'
import ModalSend from './components/modals-actions/modal-send'
import ModalApprove from './components/modals-actions/modal-approve'
import ModalGetTokens from './components/modals-actions/modal-get-tokens'
import ModalForceExit from './components/modals-actions/modal-force-exit'

function ActionView (
  desWallet,
  wallet,
  config,
  abiTokens,
  tokens,
  tokensList,
  tokensArray,
  tokensR,
  tokensA,
  tokensAArray,
  tokensRArray,
  tokensE,
  tokensTotal,
  balance,
  txs,
  txsExits,
  apiOperator,
  handleInitStateTx,
  isLoadingInfoAccount,
  handleInfoAccount,
  handleLoadFiles,
  getCurrentBatch,
  errorFiles,
  txTotal
) {
  const [state, setState] = React.useState({
    modalDeposit: false,
    modalWithdraw: false,
    modalForceExit: false,
    modalSend: false,
    modalApprove: false,
    modalGetTokens: false,
    modalError: false,
    error: '',
    activeItem: '',
    noImported: false,
    babyjub: '0x0000000000000000000000000000000000000000',
    lengthTx: 0
  })

  const getInfoAccount = React.useCallback(async () => {
    if (Object.keys(desWallet).length !== 0) {
      await handleInfoAccount(
        config.nodeEth,
        abiTokens,
        wallet,
        config.operator,
        config.address,
        config.abiRollup,
        desWallet
      )
    }
  }, [config, abiTokens, desWallet, wallet, handleInfoAccount])

  const infoOperator = React.useCallback(() => {
    getCurrentBatch(config.operator)
    setTimeout(infoOperator, 30000)
  }, [config, getCurrentBatch])

  React.useEffect(() => {
    getInfoAccount()
    infoOperator()
    if (Object.keys(desWallet).length === 0 || errorFiles !== '') {
      setState({ ...state, noImported: true })
    } else {
      setState({
        ...state,
        babyjub: pointToCompress(desWallet.babyjubWallet.publicKey),
        lengthTx: txTotal.length
      })
    }
  }, [desWallet, txTotal, errorFiles, state, setState, getInfoAccount, infoOperator])

  React.useEffect(() => {
    if (txTotal.length > state.lengthTx) {
      setState({ ...state, lengthTx: txTotal.length })
      getInfoAccount()
    }
  }, [txTotal, state, setState, getInfoAccount])

  async function changeNode (currentNode) {
    handleInitStateTx()
    config.nodeEth = currentNode

    const nodeLoad = await handleLoadFiles(config)

    await getInfoAccount()
    if (Object.keys(desWallet).length === 0 || !nodeLoad) {
      setState({ ...state, noImported: true })
    } else {
      setState({
        ...state,
        babyjub: pointToCompress(desWallet.babyjubWallet.publicKey),
        noImported: false
      })
    }
  }

  function handleItemClick (event, { name }) {
    event.preventDefault()
    setState({ ...state, activeItem: name })
    if (name === 'deposit') {
      setState({ ...state, modalDeposit: true })
    } else if (name === 'withdraw') {
      setState({ ...state, modalWithdraw: true })
    } else if (name === 'send' || name === 'send0') {
      setState({ ...state, modalSend: true })
    } else if (name === 'approve') {
      setState({ ...state, modalApprove: true })
    } else if (name === 'getTokens') {
      setState({ ...state, modalGetTokens: true })
    } else if (name === 'forcexit') {
      setState({ ...state, modalForceExit: true })
    }
  }

  function handleToggleModalDeposit () {
    setState({ ...state, modalDeposit: !state.modalDeposit })
  }

  function handleToggleModalWithdraw () {
    setState({ ...state, modalWithdraw: !state.modalWithdraw })
  }

  function handleToggleModalForceExit () {
    setState({ ...state, modalForceExit: !state.modalForceExit })
  }

  function handleToggleModalSend () {
    setState({ ...state, modalSend: !state.modalSend })
  }

  function handleToggleModalApprove () {
    setState({ ...state, modalApprove: !state.modalApprove })
  }

  function handleToggleModalGetTokens () {
    setState({ ...state, modalGetTokens: !state.modalGetTokens })
  }

  function handleToggleModalError () {
    setState({ ...state, modalError: !state.modalError })
  }

  function redirectInitView () {
    if (Object.keys(desWallet).length === 0) {
      return <Redirect to='/' />
    }
  }

  return (
    <Container textAlign='center'>
      <MenuBack
        config={config}
        changeNode={changeNode}
        isLoadingInfoAccount={isLoadingInfoAccount}
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
        onItemClick={handleItemClick}
        noImported={state.noImported}
      />
      <MessageTx />
      <InfoWallet
        desWallet={desWallet}
        balance={balance}
        tokens={tokens}
        tokensR={tokensR}
        tokensE={tokensE}
        tokensA={tokensA}
        tokensArray={tokensArray}
        tokensAArray={tokensAArray}
        tokensTotal={tokensTotal}
        isLoadingInfoAccount={isLoadingInfoAccount}
        getInfoAccount={getInfoAccount}
        txs={txs}
        txsExits={txsExits}
        noImported={state.noImported}
      />
      <br />
      <InfoTx
        desWallet={desWallet}
      />
      <ModalDeposit
        balance={balance}
        tokensList={tokensList}
        tokensA={tokensA}
        modalDeposit={state.modalDeposit}
        onToggleModalDeposit={handleToggleModalDeposit}
      />
      <ModalWithdraw
        desWallet={desWallet}
        modalWithdraw={state.modalWithdraw}
        onToggleModalWithdraw={handleToggleModalWithdraw}
      />
      <ModalForceExit
        tokensList={tokensList}
        desWallet={desWallet}
        babyjub={state.babyjub}
        modalForceExit={state.modalForceExit}
        onToggleModalForceExit={handleToggleModalForceExit}
      />
      <ModalSend
        tokensRArray={tokensRArray}
        babyjub={state.babyjub}
        apiOperator={apiOperator}
        modalSend={state.modalSend}
        onToggleModalSend={handleToggleModalSend}
        activeItem={state.activeItem}
      />
      <ModalApprove
        balance={balance}
        modalApprove={state.modalApprove}
        onToggleModalApprove={handleToggleModalApprove}
        tokensA={tokensA}
      />
      <ModalGetTokens
        balance={balance}
        modalGetTokens={state.modalGetTokens}
        onToggleModalGetTokens={handleToggleModalGetTokens}
      />
      <ModalError
        error={state.error}
        modalError={state.modalError}
        onToggleModalError={handleToggleModalError}
      />
      {redirectInitView()}
      <br />
    </Container>
  )
}

ActionView.propTypes = {
  desWallet: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
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
  handleInitStateTx: PropTypes.func.isRequired,
  isLoadingInfoAccount: PropTypes.bool.isRequired,
  handleInfoAccount: PropTypes.func.isRequired,
  handleLoadFiles: PropTypes.func.isRequired,
  getCurrentBatch: PropTypes.func.isRequired,
  errorFiles: PropTypes.string.isRequired,
  txTotal: PropTypes.array.isRequired
}

ActionView.defaultProps = {
  tokens: '0',
  tokensR: '0',
  tokensE: '0',
  balance: '0',
  txs: [],
  txsExits: [],
  tokensArray: [],
  tokensAArray: []
}

const mapStateToProps = (state) => ({
  wallet: state.general.wallet,
  desWallet: state.general.desWallet,
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
  errorFiles: state.general.errorFiles,
  txTotal: state.txState.txTotal
})

export default connect(mapStateToProps, {
  handleGetTokens,
  handleApprove,
  handleInfoAccount,
  handleLoadFiles,
  handleInitStateTx,
  getCurrentBatch
})(ActionView)
