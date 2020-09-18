import { createUseStyles } from 'react-jss'

const useTransactionActionsStyles = createUseStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  button: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  buttonText: {
    fontWeight: theme.fontWeights.bold
  }
}))

export default useTransactionActionsStyles
