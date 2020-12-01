import { createUseStyles } from 'react-jss'

const useTransactionActionsStyles = createUseStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  action: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  button: {
    display: 'flex',
    padding: theme.spacing(2.5),
    background: theme.palette.white,
    borderRadius: '50%',
    margin: `0 ${theme.spacing(2.5)}px ${theme.spacing(1.5)}px`
  },
  buttonText: {
    fontWeight: theme.fontWeights.bold
  },
  buttonIcon: {
    width: 24,
    height: 24
  }
}))

export default useTransactionActionsStyles
