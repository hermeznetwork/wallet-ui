import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Message, Icon, Divider } from 'semantic-ui-react'

function MessageTx ({
  isLoadingDeposit,
  isLoadingWithdraw,
  isLoadingForceExit,
  isLoadingSend,
  isLoadingApprove,
  isLoadingGetTokens,
  successSend,
  successTx,
  successDeposit,
  successForceExit,
  error,
  errorConfig,
  tx,
  chainId,
  messageOpen
}) {
  function getUrl () {
    let net

    if (chainId === -1) {
      return ''
    }

    if (chainId === 5) {
      net = 'goerli.'
    } else if (chainId === 3) {
      net = 'ropsten.'
    } else if (chainId === 4) {
      net = 'rinkeby.'
    } else {
      net = ''
    }

    return (
      <a
        href={`https://${net}etherscan.io/tx/${tx.hash}`}
        target='_blank'
        rel='noopener noreferrer'
      >
        View on Etherscan
      </a>
    )
  }

  function getMessage () {
    if (errorConfig !== '') {
      return (
        <Message icon color='red'>
          <Icon name='exclamation' />
          <Message.Content>
            <Message.Header>
              Error!
              {errorConfig}
            </Message.Header>
          </Message.Content>
        </Message>
      )
    }
    if (isLoadingDeposit === true || isLoadingWithdraw === true ||
      isLoadingSend === true || isLoadingApprove === true ||
      isLoadingGetTokens === true || isLoadingForceExit === true) {
      return (
        <Message icon color='orange'>
          <Icon name='circle notched' loading />
          <Message.Content>
            <Message.Header>Waiting for the transaction...</Message.Header>
          </Message.Content>
        </Message>
      )
    } if (error !== '' && messageOpen) {
      return (
        <Message icon color='red'>
          <Icon name='exclamation' />
          <Message.Content>
            <Message.Header>Error!</Message.Header>
            <p>{error}</p>
          </Message.Content>
        </Message>
      )
    } if (successTx === true && messageOpen) {
      return (
        <Message icon color='green'>
          <Icon name='check' />
          <Message.Content>
            <Message.Header>Transaction sent!</Message.Header>
            <p>
              Transaction is being mined... Please click Reload in few seconds!
            </p>
            {getUrl()}
          </Message.Content>
        </Message>
      )
    } if (successDeposit === true && messageOpen) {
      return (
        <Message icon color='green'>
          <Icon name='check' />
          <Message.Content>
            <Message.Header>Transaction sent!</Message.Header>
            <p>Transaction is being forged... Please click Reload in few seconds!</p>
            {getUrl()}
          </Message.Content>
        </Message>
      )
    } if (successForceExit === true && messageOpen) {
      return (
        <Message icon color='green'>
          <Icon name='check' />
          <Message.Content>
            <Message.Header>Transaction sent!</Message.Header>
            <p>Transaction is being forged... Please click Reload in few seconds!</p>
            {getUrl()}
          </Message.Content>
        </Message>
      )
    } if (successSend === true && messageOpen) {
      return (
        <Message icon color='green'>
          <Icon name='check' />
          <Message.Content>
            <Message.Header>
              Transaction sent! If you send before the next batch, it may not be done correctly.
            </Message.Header>
            <p>Transaction is being forged... Please click Reload in few seconds!</p>
          </Message.Content>
        </Message>
      )
    }
    return <Divider />
  }

  return (
    <div>
      {getMessage()}
    </div>
  )
}

MessageTx.propTypes = {
  isLoadingDeposit: PropTypes.bool.isRequired,
  isLoadingWithdraw: PropTypes.bool.isRequired,
  isLoadingForceExit: PropTypes.bool.isRequired,
  isLoadingSend: PropTypes.bool.isRequired,
  isLoadingApprove: PropTypes.bool.isRequired,
  isLoadingGetTokens: PropTypes.bool.isRequired,
  successSend: PropTypes.bool.isRequired,
  successTx: PropTypes.bool.isRequired,
  successDeposit: PropTypes.bool.isRequired,
  successForceExit: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  errorConfig: PropTypes.string.isRequired,
  tx: PropTypes.object.isRequired,
  chainId: PropTypes.number.isRequired,
  messageOpen: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => ({
  isLoadingDeposit: state.transactions.isLoadingDeposit,
  isLoadingWithdraw: state.transactions.isLoadingWithdraw,
  isLoadingForceExit: state.transactions.isLoadingForceExit,
  isLoadingSend: state.transactions.isLoadingSend,
  isLoadingApprove: state.transactions.isLoadingApprove,
  isLoadingGetTokens: state.transactions.isLoadingGetTokens,
  successSend: state.transactions.successSend,
  successTx: state.transactions.successTx,
  successForceExit: state.transactions.successForceExit,
  successDeposit: state.transactions.successDeposit,
  error: state.transactions.error,
  errorConfig: state.general.errorConfig,
  tx: state.transactions.tx,
  batch: state.transactions.batch,
  messageOpen: state.transactions.messageOpen,
  chainId: state.general.chainId
})

export default connect(mapStateToProps)(MessageTx)
