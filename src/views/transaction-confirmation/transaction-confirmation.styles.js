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
    marginTop: `${theme.spacing(15)}px`,
    width: `${theme.spacing(51)}px`
  },
  text: {
    fontSize: `${theme.spacing(3)}px`,
    color: theme.palette.black.light,
    fontWeight: theme.fontWeights.bold,
    marginTop: `${theme.spacing(6)}px`
  },
  doneWrapper: {
    marginTop: `${theme.spacing(25)}px`
  },
  done: {
    cursor: 'pointer',
    backgroundColor: theme.palette.secondary,
    borderRadius: 18,
    border: 0,
    outline: 'none',
    color: theme.palette.white,
    fontSize: `${theme.spacing(3)}px`,
    fontWeight: theme.fontWeights.bold,
    padding: `${theme.spacing(3)}px 0`,
    width: `${theme.spacing(24)}px`
  }
}))

export default useTransactionConfirmationStyles
