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
  },
  panelContainer: {
    height: '100% !important',
    position: 'absolute !important',
    zIndex: '1',
    boxShadow: '-5px 14px 30px rgba(136, 139, 170, 0.15)',
    borderRadius: '30px 0 0 30px'
  },
  panel: {
    backgroundColor: theme.palette.white,
    height: '100%',
    padding: theme.spacing(3)
  },
  hidePanel: {
    background: theme.palette.grey.light,
    borderRadius: '100px',
    marginTop: theme.spacing(3),
    fontWeight: theme.fontWeights.bold,
    lineHeight: `${theme.spacing(2)}px`,
    padding: `${theme.spacing(1.25)}px ${theme.spacing(2)}px`,
    color: theme.palette.black
  },
  panelTitle: {
    fontWeight: theme.fontWeights.bold,
    fontSize: theme.spacing(3),
    lineHeight: `${theme.spacing(4.75)}px`
  },
  panelTimeLeft: {
    width: '100%',
    height: theme.spacing(4),
    background: theme.palette.grey.light,
    borderRadius: '100px',
    fontWeight: theme.fontWeights.bold,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}))

export default useHomeStyles
