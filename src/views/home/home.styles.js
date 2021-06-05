import { createUseStyles } from 'react-jss'

const useHomeStyles = createUseStyles(theme => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  section: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  sectionLast: {
    marginBottom: theme.spacing(3)
  },
  walletAddress: {
    marginTop: theme.spacing(2)
  },
  accountBalance: {
    marginTop: `${theme.spacing(4)}px`,
    marginBottom: `${theme.spacing(3)}px`,
    fontSize: theme.spacing(5),
    '& div': {
      color: theme.palette.black,
      fontWeight: theme.fontWeights.medium
    }
  },
  emptyAccounts: {
    maxWidth: 240,
    fontSize: theme.spacing(2.5),
    fontWeight: theme.fontWeights.medium,
    lineHeight: 1.8,
    color: theme.palette.grey.main,
    textAlign: 'center'
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

export default useHomeStyles
