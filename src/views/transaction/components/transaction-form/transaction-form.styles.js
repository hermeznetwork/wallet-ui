import { createUseStyles } from 'react-jss'

const useAccountListStyles = createUseStyles(theme => ({
  root: {
    marginTop: theme.headerHeight,
    marginBottom: theme.spacing(3),
    paddingTop: theme.spacing(4),
    [theme.breakpoints.upSm]: {
      paddingTop: theme.spacing(6)
    }
  },
  sectionWrapper: {
    width: '100%'
  },
  token: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.palette.grey.light,
    borderRadius: 12,
    height: theme.spacing(10),
    marginBottom: theme.spacing(2.5),
    padding: `${theme.spacing(4)}px ${theme.spacing(5)}px`,
    fontSize: `${theme.spacing(2.5)}px`,
    fontWeight: theme.fontWeights.bold,
    color: theme.palette.black,
    [theme.breakpoints.upSm]: {
      marginBottom: theme.spacing(6)
    }
  },
  selectAmount: {
    border: `solid 2px ${theme.palette.grey.veryLight}`,
    borderRadius: 12
  },
  selectAmountError: {
    borderColor: theme.palette.red.main
  },
  amount: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(2),
    [theme.breakpoints.upSm]: {
      padding: theme.spacing(5.5)
    }
  },
  amountCurrency: {
    fontSize: `${theme.spacing(2)}px`,
    fontWeight: theme.fontWeights.bold,
    color: theme.palette.black,
    [theme.breakpoints.upSm]: {
      fontSize: `${theme.spacing(3)}px`,
      marginBottom: theme.spacing(1.5)
    }
  },
  amountInput: {
    width: '100%',
    border: 0,
    outline: 'none',
    caretColor: theme.palette.orange.main,
    fontSize: `${theme.spacing(6)}px`,
    fontWeight: theme.fontWeights.bold,
    color: theme.palette.black,
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
    borderTop: `solid 2px ${theme.palette.grey.veryLight}`,
    fontSize: `${theme.spacing(2)}px`,
    fontWeight: theme.fontWeights.bold,
    color: theme.palette.grey.main,
    flex: 1,
    padding: `${theme.spacing(2)}px 0`,
    [theme.breakpoints.upSm]: {
      fontSize: `${theme.spacing(3)}px`,
      padding: `${theme.spacing(3.5)}px 0`
    }
  },
  sendAll: {
    borderRight: `solid 2px ${theme.palette.grey.veryLight}`
  },
  changeCurrency: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  changeCurrencyIcon: {
    marginRight: theme.spacing(1)
  },
  errorMessage: {
    display: 'none',
    alignItems: 'center',
    marginTop: theme.spacing(1.5),
    fontSize: `${theme.spacing(2)}px`,
    fontWeight: theme.fontWeights.medium,
    color: theme.palette.red.main
  },
  selectAmountErrorMessageVisible: {
    display: 'flex'
  },
  errorIcon: {
    marginRight: theme.spacing(1),
    width: theme.spacing(2.5),
    height: theme.spacing(2.5)
  },
  receiverInputWrapper: {
    width: '100%',
    position: 'relative',
    marginTop: theme.spacing(5),
    borderRadius: 12,
    border: `solid 2px ${theme.palette.grey.veryLight}`,
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden'
  },
  receiver: {
    width: '100%',
    padding: `${theme.spacing(3)}px ${theme.spacing(1)}px ${theme.spacing(3)}px ${theme.spacing(2.5)}px`,
    fontSize: `${theme.spacing(2)}px`,
    color: theme.palette.black.dark,
    fontWeight: theme.fontWeights.medium,
    outline: 0,
    border: 'none',
    '&::placeholder': {
      color: theme.palette.grey.main,
      opacity: 1
    },
    [theme.breakpoints.upSm]: {
      fontSize: `${theme.spacing(3)}px`,
      padding: `${theme.spacing(5.5)}px ${theme.spacing(2)}px ${theme.spacing(5.5)}px ${theme.spacing(5)}px`
    }
  },
  receiverError: {
    borderColor: theme.palette.red.main
  },
  receiverErrorMessageVisible: {
    display: 'flex'
  },
  receiverButtons: {
    display: 'flex'
  },
  receiverButton: {
    border: 0,
    background: 'transparent',
    outline: 'none',
    cursor: 'pointer',
    padding: theme.spacing(2),
    marginRight: theme.spacing(0.5),
    fontWeight: theme.fontWeights.bold,
    color: theme.palette.black,
    [theme.breakpoints.upSm]: {
      fontSize: theme.spacing(2.5),
      marginRight: theme.spacing(3)
    }
  },
  receiverButtonIcon: {
    width: 22,
    height: 22,
    '& path': {
      fill: theme.palette.black
    }
  },
  receiverDeleteButtonIcon: {
    width: 32,
    height: 32
  },
  feeWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginTop: theme.spacing(2.5),
    [theme.breakpoints.upSm]: {
      marginTop: theme.spacing(4.5)
    }
  },
  fee: {
    fontSize: `${theme.spacing(2)}px`,
    fontWeight: theme.fontWeights.medium,
    color: theme.palette.grey.main,
    marginBottom: theme.spacing(1),
    [theme.breakpoints.upSm]: {
      fontSize: `${theme.spacing(3)}px`,
      padding: `${theme.spacing(2)}px 0`
    }
  },
  feeIcon: {
    width: theme.spacing(2),
    height: theme.spacing(2)
  }
}))

export default useAccountListStyles
