import React from 'react'
import PropTypes from 'prop-types'
import {
  Button, Modal, Form, Icon, Message, Progress
} from 'semantic-ui-react'

function getDefaultWalletName () {
  const walletNamePrefix = 'zkrollup-backup'
  const date = new Date(Date.now())
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const min = date.getMinutes()

  return `${walletNamePrefix}-${year}${month}${day}-${hour}${min}`
}

function ModalCreate ({
  isOpen,
  errorCreateWallet,
  isCreatingWallet,
  isLoadingWallet,
  desc,
  step,
  onCreateWallet,
  onClose
}) {
  const [password, setPassword] = React.useState('')
  const [walletName, setWalletName] = React.useState(getDefaultWalletName())
  const [passwordsMatch, setPasswordsMatch] = React.useState(undefined)

  function handleWalletNameChange (event) {
    setWalletName(event.target.value)
  }

  function handlePasswordChange (event) {
    setPassword(event.target.value)
  }

  function handleCheckPasswords (event) {
    setPasswordsMatch(password === event.target.value)
  }

  return (
    <Modal open={isOpen}>
      <Modal.Header>Rollup Wallet</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <label htmlFor='filename'>
              File Name
              <input type='text' id='filename' value={walletName} onChange={handleWalletNameChange} />
            </label>
          </Form.Field>
          <Form.Field>
            <label htmlFor='password'>
              Password
              <input type='password' id='password' onChange={handlePasswordChange} />
            </label>
          </Form.Field>
          <Form.Field>
            <label htmlFor='password2'>
              Repeat password
              <input type='password' id='password2' onChange={handleCheckPasswords} />
            </label>
          </Form.Field>
        </Form>
        {
          !isCreatingWallet && !isLoadingWallet && passwordsMatch
            ? (
              <Message positive>
                <Icon name='check' />
                Passwords match
              </Message>
            )
            : (
              <></>
            )
        }
        {
          !isCreatingWallet && !isLoadingWallet && passwordsMatch === false
            ? (
              <Message error>
                <Icon name='exclamation' />
                Passwords do not match
              </Message>
            )
            : (
              <></>
            )
        }
        {
          isCreatingWallet || isLoadingWallet
            ? (
              <div>
                <Message warning>
                  <Icon name='circle notched' loading />
                  Your wallet is being created and imported...
                  This may take a few seconds!
                </Message>
                <p>{desc}</p>
                <Progress value={step} total='4' progress='ratio' color='blue' active />
              </div>
            ) : (
              <></>
            )
        }
        {
          errorCreateWallet
            ? (
              <Message error>
                Error
              </Message>
            )
            : (
              <></>
            )
        }
      </Modal.Content>
      <Modal.Actions>
        <Button color='blue' onClick={() => onCreateWallet(walletName, password)} disabled={!passwordsMatch}>
          <Icon name='check' />
            Create
        </Button>
        <Button color='grey' basic onClick={onClose}>
          <Icon name='close' />
            Close
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

ModalCreate.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  errorCreateWallet: PropTypes.string,
  isCreatingWallet: PropTypes.bool.isRequired,
  isLoadingWallet: PropTypes.bool.isRequired,
  desc: PropTypes.string,
  step: PropTypes.number.isRequired,
  onCreateWallet: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
}

export default ModalCreate
