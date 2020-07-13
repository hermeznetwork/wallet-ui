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
} from '../../store/general/actions'
import { handleInitStateTx } from '../../store/tx/actions'
import { handleResetTxs } from '../../store/tx-state/actions'

const config = require('../../utils/config.json')

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
  const [state, setState] = React.useState({
    isLoaded: false,
    modalImport: false,
    modalCreate: false,
    walletImport: '',
    nameWallet: '',
    step: 0,
    desc: ''
  })
  const passwordRef = React.createRef()
  const fileNameRef = React.createRef()
  const { search } = useLocation()

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
      setState({ ...state, isLoaded: true, modalImport: false })
    }
    if (created === true && state.isLoaded === true && state.modalCreate === true) {
      setState({ ...state, modalCreate: false })
    }
  }, [isLoadingWallet, desWallet, created, state, setState])

  function handleChangeWallet (event) {
    event.preventDefault()
    setState({ ...state, walletImport: event.target.files[0] })
  }

  async function handleClickImport () {
    try {
      setState({ ...state, step: 0, desc: '' })
      if (state.walletImport === '' || passwordRef.current.value === '') {
        throw new Error('Incorrect wallet or password')
      } else {
        await onInitStateTx()
        onResetTxs()
        await onLoadFiles(config)
        setState({ ...state, step: 1, desc: '1/3 Loading Operator' })
        await onLoadOperator(config)
        setState({ ...state, step: 2, desc: '2/3 Loading Wallet' })
        await onLoadWallet(state.walletImport, passwordRef.current.value, true)
      }
    } catch (err) {
      setState({
        ...state,
        walletImport: ''
      })
    }
  }

  async function handleClickCreate () {
    try {
      setState({ ...state, step: 0, desc: '' })

      const fileName = fileNameRef.current.value
      const password = passwordRef.current.value

      if (fileName === '' || password === '') {
        throw new Error('Incorrect wallet or password')
      } else {
        setState({ ...state, step: 1, desc: '1/4 Creating Wallet' })

        const encWallet = await onCreateWallet(fileName, password)

        await onInitStateTx()
        await onLoadFiles(config)
        setState({ ...state, step: 2, desc: '2/4 Loading Operator' })
        await onLoadOperator(config)
        setState({ ...state, step: 3, desc: '3/4 Loading Wallet' })
        await onLoadWallet(encWallet, password, false)
      }
    } catch (err) {
      onInitStateTx()
    }
  }

  function handleToggleModalImport () {
    setState((prev) => ({ modalImport: !prev.modalImport }))
  }

  function handleToggleModalCreate () {
    const nameWallet = 'zkrollup-backup-'
    const date = new Date(Date.now())
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const min = date.getMinutes()

    setState({
      ...state,
      modalCreate: !state.modalCreate,
      nameWallet: `${nameWallet}${year}${month}${day}-${hour}${min}`
    })
  }

  function renderRedirect () {
    if (state.isLoaded === true) {
      return <Redirect to='/actions' />
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
        modalCreate={state.modalCreate}
        onToggleModalCreate={handleToggleModalCreate}
        onClickCreate={handleClickCreate}
        fileNameRef={fileNameRef}
        passwordRef={passwordRef}
        isLoadingWallet={isLoadingWallet}
        isCreatingWallet={isCreatingWallet}
        errorCreateWallet={errorCreateWallet}
        nameWallet={state.nameWallet}
        desc={state.desc}
        step={state.step}
      />
      <ModalImport
        modalImport={state.modalImport}
        onToggleModalImport={handleToggleModalImport}
        onChangeWallet={handleChangeWallet}
        onClickImport={handleClickImport}
        passwordRef={passwordRef}
        isLoadingWallet={isLoadingWallet}
        errorWallet={errorWallet}
        desc={state.desc}
        step={state.step}
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
