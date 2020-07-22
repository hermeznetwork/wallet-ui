import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Button, Modal, Form, Icon, Message, Progress
} from 'semantic-ui-react'

function ModalImport ({
  errorWallet,
  isOpen,
  isLoadingWallet,
  desc,
  step,
  onImportWallet,
  onClose
}) {
  const [password, setPassword] = useState('')
  const [wallet, setWallet] = useState()

  function handleWalletChange (event) {
    setWallet(event.target.files[0])
  }

  function handlePasswordChange (event) {
    setPassword(event.target.value)
  }

  return (
    <Modal open={isOpen}>
      <Modal.Header>Import Wallet</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <label htmlFor='wallet-file'>
              Wallet
              <input type='file' onChange={handleWalletChange} id='wallet-file' />
            </label>
          </Form.Field>
          <Form.Field>
            <label htmlFor='password'>
              Password
              <input type='password' value={password} onChange={handlePasswordChange} id='password' />
            </label>
          </Form.Field>
        </Form>
        {
          isLoadingWallet
            ? (
              <div>
                <Message warning>
                  <Icon name='circle notched' loading />
                  Your wallet is being checked...
                  This may take a few seconds!
                </Message>
                <p>{desc}</p>
                <Progress value={step} total='3' progress='ratio' color='blue' active />
              </div>
            ) : (
              <></>
            )
        }
        {
          errorWallet
            ? (
              <Message error>
                Invalid Wallet or Password
              </Message>
            ) : (
              <></>
            )
        }
      </Modal.Content>
      <Modal.Actions>
        <Button color='blue' onClick={() => onImportWallet(wallet, password)} disabled={!wallet || !password}>
          <Icon name='check' />
          Import
        </Button>
        <Button color='grey' basic onClick={onClose}>
          <Icon name='close' />
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

ModalImport.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isLoadingWallet: PropTypes.bool.isRequired,
  errorWallet: PropTypes.string,
  desc: PropTypes.string,
  step: PropTypes.number.isRequired,
  onImportWallet: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
}

export default ModalImport
