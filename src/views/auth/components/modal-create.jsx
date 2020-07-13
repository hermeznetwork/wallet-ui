import React from 'react'
import PropTypes from 'prop-types'
import {
  Button, Modal, Form, Icon, Message, Progress
} from 'semantic-ui-react'

function ModalCreate ({
  fileNameRef,
  passwordRef,
  modalCreate,
  onClickCreate,
  onToggleModalCreate,
  errorCreateWallet,
  isCreatingWallet,
  isLoadingWallet,
  nameWallet,
  desc,
  step
}) {
  const [state, setState] = {
    password: '',
    match: ''
  }

  function isLoading () {
    if (isCreatingWallet === true || isLoadingWallet === true) {
      return (
        <div>
          <Message warning>
            <Icon name='circle notched' loading />
            Your wallet is being created and imported...
            This may take a few seconds!
          </Message>
          <p>{desc}</p>
          <Progress value={step} total='4' progress='ratio' color='blue' active />
        </div>
      )
    } if (errorCreateWallet !== '') {
      return (
        <Message error>
          Error
        </Message>
      )
    }
  }

  function handleSetPassword (event) {
    event.preventDefault()
    setState({ ...state, password: event.target.value })
  }

  function handleCheckPassword (event) {
    event.preventDefault()
    setState({ ...state, match: state.password === event.target.value })
  }

  function checkPasswordMessage () {
    if (isCreatingWallet === false && isLoadingWallet === false) {
      if (state.match === true) {
        return (
          <Message positive>
            <Icon name='check' />
            Passwords match
          </Message>
        )
      } else {
        return (
          <Message error>
            <Icon name='exclamation' />
            Passwords do not match
          </Message>
        )
      }
    }
  }

  return (
    <Modal open={modalCreate}>
      <Modal.Header>Rollup Wallet</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <label htmlFor='file-name'>
                File Name
              <input type='text' ref={fileNameRef} id='file-name' defaultValue={nameWallet} />
            </label>
          </Form.Field>
          <Form.Field>
            <label htmlFor='password'>
                Password
              <input type='password' ref={passwordRef} id='password' onChange={handleSetPassword} />
            </label>
          </Form.Field>
          <Form.Field>
            <label htmlFor='password2'>
                Repeat password
              <input type='password' id='password2' onChange={handleCheckPassword} />
            </label>
          </Form.Field>
        </Form>
        {checkPasswordMessage()}
        {isLoading()}
      </Modal.Content>
      <Modal.Actions>
        <Button color='blue' onClick={onClickCreate}>
          <Icon name='check' />
            Create
        </Button>
        <Button color='grey' basic onClick={onToggleModalCreate}>
          <Icon name='close' />
            Close
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

ModalCreate.propTypes = {
  fileNameRef: PropTypes.object.isRequired,
  passwordRef: PropTypes.object.isRequired,
  modalCreate: PropTypes.bool.isRequired,
  onClickCreate: PropTypes.func.isRequired,
  onToggleModalCreate: PropTypes.func.isRequired,
  errorCreateWallet: PropTypes.string,
  isCreatingWallet: PropTypes.bool.isRequired,
  isLoadingWallet: PropTypes.bool.isRequired,
  nameWallet: PropTypes.string,
  desc: PropTypes.string,
  step: PropTypes.number.isRequired
}

export default ModalCreate
