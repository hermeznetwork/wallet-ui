import { createUseStyles } from 'react-jss'

const useAccountListStyles = createUseStyles(theme => ({
  transaction: {},
  token: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F3F8',
    borderRadius: 16,
    height: 80,
    marginBottom: `${theme.spacing(6)}px`,
    padding: '30px 40px',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black'
  },
  selectAmount: {
    border: 'solid 2px #ebebf4',
    borderRadius: 20
  },
  selectAmountError: {
    borderColor: '#ff4b40'
  },
  amount: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: `${theme.spacing(5.5)}px`
  },
  amountCurrency: {
    margin: '0 0 12px',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333'
  },
  amountInput: {
    border: 0,
    outline: 'none',
    caretColor: '#ffa600',
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#2b2b2b',
    textAlign: 'center',
    '&::-webkit-outer-spin-button,&::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0
    },
    '&[type=number]': {
      '-moz-appearance': 'textfield'
    }
  },
  amountButtons: {
    display: 'flex'
  },
  amountButton: {
    cursor: 'pointer',
    background: 'none',
    outline: 'none',
    border: '0',
    borderTop: 'solid 2px #e1e1f1',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#888baa',
    flex: 1,
    padding: `${theme.spacing(3.5)}px 0`
  },
  sendAll: {
    borderRight: 'solid 2px #e1e1f1'
  },
  changeCurrency: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  changeCurrencyIcon: {
    marginRight: `${theme.spacing(1)}px`
  },
  selectAmountErrorMessage: {
    display: 'none',
    alignItems: 'center',
    marginTop: `${theme.spacing(1.5)}px`,
    fontSize: 16,
    fontWeight: 500,
    color: '#ff4b40'
  },
  selectAmountErrorMessageVisible: {
    display: 'flex'
  },
  errorIcon: {
    marginRight: 8,
    width: 20,
    height: 20
  },
  continue: {
    cursor: 'pointer',
    width: '100%',
    marginTop: `${theme.spacing(14.5)}px`,
    padding: '28px 0',
    backgroundColor: '#e75a2b',
    border: 0,
    outline: 'none',
    borderRadius: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    '&[disabled]': {
      backgroundColor: '#888baa'
    }
  },
  feeWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    cursor: 'pointer'
  },
  fee: {
    fontSize: 24,
    fontWeight: 500,
    color: '#888baa',
    marginBottom: 8
  },
  feeIcon: {
    width: 16,
    height: 16
  }
}))

export default useAccountListStyles
