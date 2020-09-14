import { createUseStyles } from 'react-jss'

const useAccountDetailsStyles = createUseStyles(theme => ({
  root: {
    width: '100%'
  },
  section: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  tokenBalance: {
    fontSize: theme.spacing(5),
    fontWeight: theme.fontWeights.bold,
    color: theme.palette.black,
    marginBottom: theme.spacing(1)
  },
  fiatBalance: {
    textAlign: 'center',
    fontSize: theme.spacing(2.5),
    fontWeight: theme.fontWeights.medium,
    color: theme.palette.grey.dark,
    marginBottom: theme.spacing(2)
  },
  actionButtonsGroup: {
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

export default useAccountDetailsStyles
