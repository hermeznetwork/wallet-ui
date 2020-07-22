import React from 'react'
import PropTypes from 'prop-types'
import {
  Container, Header, Divider, Button
} from 'semantic-ui-react'
import { connect } from 'react-redux'
import { Redirect, useLocation } from 'react-router-dom'

import ModalImport from './components/modal-import'
import ModalCreate from './components/modal-create'
import {
  handleLoadWallet, handleLoadFiles, handleLoadOperator, resetWallet, handleCreateWallet
} from '../../../store/general/actions'
import { handleInitStateTx } from '../../../store/tx/actions'
import { handleResetTxs } from '../../../store/tx-state/actions'

const config = require('../../../utils/config.json')

function InitView ({
  desWallet,
  isLoadingWallet,
  errorWallet,
  isCreatingWallet,
  errorCreateWallet,
  created,
  onInitStateTx,
  onLoadWallet,
  onLoadFiles,
  onLoadOperator,
  onCreateWallet,
  onResetWallet,
  onResetTxs
}) {
  const { search } = useLocation()
  const [state, setState] = React.useState({
    isLoaded: false,
    isModalImportOpen: false,
    isModalCreateOpen: false,
    step: 0,
    desc: ''
  })

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)

    onResetWallet()
    if (urlParams.has('node')) {
      const tokenInfura = urlParams.get('node')
      const node = `https://goerli.infura.io/v3/${tokenInfura}`

      config.nodeEth = node
    }
  }, [search, onResetWallet])

  React.useEffect(() => {
    if (isLoadingWallet === false && Object.keys(desWallet).length !== 0) {
      setState({ ...state, isLoaded: true, isModalImportOpen: false })
    }
    if (created === true && state.isLoaded === true && state.isModalCreateOpen === true) {
      setState({ ...state, isModalCreateOpen: false })
    }
  }, [isLoadingWallet, desWallet, created, state, setState])

  function handleToggleModalImport () {
    setState({ ...state, isModalImportOpen: !state.isModalImportOpen })
  }

  function handleToggleModalCreate () {
    setState({ ...state, isModalCreateOpen: !state.isModalCreateOpen })
  }

  async function handleWalletImport (wallet, password) {
    try {
      setState({ ...state, step: 0, desc: '' })
      if (!wallet || !password) {
        throw new Error('Incorrect wallet or password')
      } else {
        await onInitStateTx()
        onResetTxs()
        await onLoadFiles(config)
        setState({ ...state, step: 1, desc: '1/3 Loading Operator' })
        await onLoadOperator(config)
        setState({ ...state, step: 2, desc: '2/3 Loading Wallet' })
        await onLoadWallet(wallet, password, true)
      }
    } catch (err) {
      setState({
        ...state,
        walletImport: ''
      })
    }
  }

  async function handleCreateWallet (filename, password) {
    try {
      setState({ ...state, step: 0, desc: '' })

      if (!filename || !password) {
        throw new Error('Incorrect wallet or password')
      }

      setState({ ...state, step: 1, desc: '1/4 Creating Wallet' })

      const encWallet = await onCreateWallet(filename, password)

      await onInitStateTx()
      await onLoadFiles(config)
      setState({ ...state, step: 2, desc: '2/4 Loading Operator' })
      await onLoadOperator(config)
      setState({ ...state, step: 3, desc: '3/4 Loading Wallet' })
      await onLoadWallet(encWallet, password, false)
    } catch (err) {
      onInitStateTx()
    }
  }

  function renderRedirect () {
    if (state.isLoaded === true) {
      return <Redirect to='/old/actions' />
    }
  }

  return (
    <Container textAlign='center'>
      <Header
        as='h1'
        style={{
          fontSize: '4em',
          fontWeight: 'normal',
          marginBottom: 0,
          marginTop: '3em'
        }}
      >
        Rollup
      </Header>
      <Divider />
      <Button.Group vertical>
        <Button
          content='Create New Rollup Wallet'
          icon='plus'
          size='massive'
          color='blue'
          onClick={handleToggleModalCreate}
        />
        <Divider />
        <Button
          content='Import Rollup Wallet'
          icon='upload'
          size='massive'
          color='violet'
          onClick={handleToggleModalImport}
        />
      </Button.Group>
      <ModalCreate
        isOpen={state.isModalCreateOpen}
        isLoadingWallet={isLoadingWallet}
        isCreatingWallet={isCreatingWallet}
        errorCreateWallet={errorCreateWallet}
        desc={state.desc}
        step={state.step}
        onCreateWallet={handleCreateWallet}
        onClose={handleToggleModalCreate}
      />
      <ModalImport
        isOpen={state.isModalImportOpen}
        isLoadingWallet={isLoadingWallet}
        errorWallet={errorWallet}
        desc={state.desc}
        step={state.step}
        onClose={handleToggleModalImport}
        onImportWallet={handleWalletImport}
      />
      {renderRedirect()}
    </Container>
  )
}

InitView.propTypes = {
  desWallet: PropTypes.object.isRequired,
  isLoadingWallet: PropTypes.bool.isRequired,
  errorWallet: PropTypes.string.isRequired,
  isCreatingWallet: PropTypes.bool.isRequired,
  errorCreateWallet: PropTypes.string.isRequired,
  created: PropTypes.bool.isRequired,
  onInitStateTx: PropTypes.func.isRequired,
  onLoadWallet: PropTypes.func.isRequired,
  onLoadFiles: PropTypes.func.isRequired,
  onLoadOperator: PropTypes.func.isRequired,
  onCreateWallet: PropTypes.func.isRequired,
  onResetWallet: PropTypes.func.isRequired,
  onResetTxs: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  isLoadingWallet: state.general.isLoadingWallet,
  isCreatingWallet: state.general.isCreatingWallet,
  errorCreateWallet: state.general.errorCreateWallet,
  desWallet: state.general.wallet,
  created: state.general.created,
  errorWallet: state.general.errorWallet
})

export default connect(mapStateToProps, {
  onLoadWallet: handleLoadWallet,
  onLoadFiles: handleLoadFiles,
  onLoadOperator: handleLoadOperator,
  onResetWallet: resetWallet,
  onInitStateTx: handleInitStateTx,
  onCreateWallet: handleCreateWallet,
  onResetTxs: handleResetTxs
})(InitView)
