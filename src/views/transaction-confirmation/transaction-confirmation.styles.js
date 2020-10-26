import { createUseStyles } from 'react-jss'

const useTransactionConfirmationStyles = createUseStyles(theme => ({
  wrapper: {
    width: '100%',
    minHeight: '100%',
    backgroundColor: theme.palette.primary.main,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column'
  },
  image: {
    marginTop: `${theme.spacing(13.5)}px`,
    width: `${theme.spacing(32)}px`
  },
  text: {
    fontSize: `${theme.spacing(3)}px`,
    color: theme.palette.black.light,
    fontWeight: theme.fontWeights.bold,
    marginTop: `${theme.spacing(6)}px`
  },
  doneWrapper: {
    marginTop: `${theme.spacing(9)}px`,
    [theme.breakpoints.upSm]: {
      fontSize: `${theme.spacing(3)}px`,
      marginTop: `${theme.spacing(18)}px`
    }
  },
  done: {
    cursor: 'pointer',
    backgroundColor: theme.palette.secondary.main,
    borderRadius: 18,
    border: 0,
    outline: 'none',
    color: theme.palette.white,
    fontSize: `${theme.spacing(2.5)}px`,
    fontWeight: theme.fontWeights.bold,
    padding: `${theme.spacing(2.25)}px 0`,
    width: `${theme.spacing(24)}px`,
    [theme.breakpoints.upSm]: {
      fontSize: `${theme.spacing(3)}px`,
      padding: `${theme.spacing(3)}px 0`
    }
  }
}))

export default useTransactionConfirmationStyles
