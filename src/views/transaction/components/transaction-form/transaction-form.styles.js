import { createUseStyles } from 'react-jss'

const useTransactionFormStyles = createUseStyles(theme => ({
  root: {
    marginTop: theme.headerHeight,
    marginBottom: theme.spacing(3),
    paddingTop: theme.spacing(4),
    [theme.breakpoints.upSm]: {
      paddingTop: theme.spacing(3.5)
    }
  },
  sectionWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  token: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.palette.grey.light,
    borderRadius: 12,
    height: theme.spacing(7.5),
    marginBottom: theme.spacing(2.5),
    padding: theme.spacing(2.5),
    fontSize: `${theme.spacing(2)}px`,
    fontWeight: theme.fontWeights.bold,
    color: theme.palette.black,
    [theme.breakpoints.upSm]: {
      fontSize: `${theme.spacing(2.5)}px`,
      height: theme.spacing(8),
      padding: `${theme.spacing(3)}px ${theme.spacing(5)}px ${theme.spacing(2.5)}px`,
      marginBottom: theme.spacing(2)
    }
  },
  tokenSymbolAmount: {
    fontWeight: theme.fontWeights.medium
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  selectAmount: {
    border: `solid 2px ${theme.palette.grey.veryLight}`,
    borderRadius: 12,
    width: '100%'
  },
  selectAmountError: {
    borderColor: theme.palette.red.main
  },
  amount: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(2.5),
    [theme.breakpoints.upSm]: {
      padding: `${theme.spacing(5)}px ${theme.spacing(6)}px ${theme.spacing(4)}px`
    }
  },
  amountCurrency: {
    fontSize: `${theme.spacing(2)}px`,
    fontWeight: theme.fontWeights.bold,
    color: theme.palette.black,
    marginBottom: theme.spacing(0.5),
    [theme.breakpoints.upSm]: {
      fontSize: `${theme.spacing(2.5)}px`,
      marginBottom: theme.spacing(1.5)
    }
  },
  amountInput: {
    width: '100%',
    border: 0,
    outline: 'none',
    caretColor: theme.palette.orange.main,
    fontSize: `${theme.spacing(5)}px`,
    fontWeight: theme.fontWeights.bold,
    color: theme.palette.black,
    textAlign: 'center',
    '&::-webkit-outer-spin-button,&::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0
    },
    '&[type=number]': {
      '-moz-appearance': 'textfield'
    },
    [theme.breakpoints.upSm]: {
      fontSize: `${theme.spacing(5)}px`
    }
  },
  amountButtons: {
    display: 'flex',
    borderTop: `solid 2px ${theme.palette.grey.veryLight}`,
    justifyContent: 'space-between',
    padding: `0 ${theme.spacing(3)}px`,
    [theme.breakpoints.upSm]: {
      padding: `0 ${theme.spacing(6)}px`
    }
  },
  amountButtonsItem: {
    background: 'none',
    outline: 'none',
    border: 0,
    fontSize: `${theme.spacing(2)}px`,
    fontWeight: theme.fontWeights.medium,
    color: theme.palette.grey.main,
    padding: `${theme.spacing(2)}px 0`,
    textAlign: 'center',
    [theme.breakpoints.upSm]: {
      fontSize: `${theme.spacing(2.5)}px`,
      lineHeight: `${theme.spacing(2.5)}px`,
      padding: `${theme.spacing(2)}px 0 ${theme.spacing(2.5)}px`
    }
  },
  amountButton: {
    cursor: 'pointer',
    transition: theme.hoverTransition,
    '&:hover': {
      color: theme.palette.black,
      '& path': {
        fill: theme.palette.black
      }
    }
  },
  amountMax: {
    fontWeight: theme.fontWeights.bold
  },
  changeCurrency: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  changeCurrencyIcon: {
    height: theme.spacing(2.5)
  },
  errorMessage: {
    display: 'none',
    alignItems: 'center',
    marginTop: theme.spacing(1.5),
    fontSize: `${theme.spacing(2)}px`,
    fontWeight: theme.fontWeights.medium,
    color: theme.palette.red.main,
    width: '100%'
  },
  selectAmountErrorMessageVisible: {
    display: 'flex'
  },
  errorIcon: {
    marginRight: theme.spacing(1),
    width: theme.spacing(2.5),
    height: theme.spacing(2.5)
  },
  receiverWrapper: {
    width: '100%'
  },
  receiverInputWrapper: {
    width: '100%',
    position: 'relative',
    marginTop: theme.spacing(4),
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
    color: theme.palette.black,
    fontWeight: theme.fontWeights.medium,
    outline: 0,
    border: 'none',
    '&::placeholder': {
      color: theme.palette.grey.main,
      opacity: 1
    },
    '&:disabled': {
      color: theme.palette.black,
      background: theme.palette.white
    },
    [theme.breakpoints.upSm]: {
      fontSize: `${theme.spacing(2.5)}px`,
      padding: `${theme.spacing(4.5)}px ${theme.spacing(2)}px ${theme.spacing(4)}px ${theme.spacing(5)}px`
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
  }
}))

export default useTransactionFormStyles
