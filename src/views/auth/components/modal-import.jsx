import React from 'react'
import PropTypes from 'prop-types'
import {
  Button, Modal, Form, Icon, Message, Progress
} from 'semantic-ui-react'

function ModalImport ({
  passwordRef,
  errorWallet,
  modalImport,
  isLoadingWallet,
  onChangeWallet,
  onClickImport,
  onToggleModalImport,
  desc,
  step
}) {
  function isLoading () {
    if (isLoadingWallet === true) {
      return (
        <div>
          <Message warning>
            <Icon name='circle notched' loading />
              Your wallet is being checked...
              This may take a few seconds!
          </Message>
          <p>{desc}</p>
          <Progress value={step} total='3' progress='ratio' color='blue' active />
        </div>
      )
    } if (errorWallet !== '') {
      return (
        <Message error>
            Invalid Wallet or Password
        </Message>
      )
    }
  }

  return (
    <Modal open={modalImport}>
      <Modal.Header>Import Wallet</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <label htmlFor='wallet-file'>
                  Wallet
              <input type='file' onChange={(e) => onChangeWallet(e)} id='wallet-file' />
            </label>
          </Form.Field>
          <Form.Field>
            <label htmlFor='password'>
                  Password
              <input type='password' ref={passwordRef} id='password' />
            </label>
          </Form.Field>
        </Form>
        {isLoading()}
      </Modal.Content>
      <Modal.Actions>
        <Button color='blue' onClick={onClickImport}>
          <Icon name='check' />
              Import
        </Button>
        <Button color='grey' basic onClick={onToggleModalImport}>
          <Icon name='close' />
              Close
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

ModalImport.propTypes = {
  passwordRef: PropTypes.object.isRequired,
  errorWallet: PropTypes.string,
  modalImport: PropTypes.bool.isRequired,
  isLoadingWallet: PropTypes.bool.isRequired,
  onChangeWallet: PropTypes.func.isRequired,
  onClickImport: PropTypes.func.isRequired,
  onToggleModalImport: PropTypes.func.isRequired,
  desc: PropTypes.string,
  step: PropTypes.number.isRequired
}

export default ModalImport
