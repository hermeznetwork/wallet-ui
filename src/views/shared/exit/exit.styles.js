import { createUseStyles } from 'react-jss'

const useExitStyles = createUseStyles(theme => ({
  root: {
    width: '100%',
    borderRadius: 18,
    backgroundColor: theme.palette.black,
    padding: `${theme.spacing(2.5)}px ${theme.spacing(5)}px ${theme.spacing(3.5)}px`,
    marginBottom: `${theme.spacing(2.5)}px`
  },
  step: {
    color: theme.palette.grey.dark,
    fontWeight: theme.fontWeights.medium,
    fontSize: theme.spacing(1.75),
    marginBottom: theme.spacing(2)
  },
  rowTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(1)
  },
  txType: {
    color: theme.palette.white,
    fontWeight: theme.fontWeights.bold,
    fontSize: theme.spacing(2.5)
  },
  amountFiat: {
    color: theme.palette.white,
    fontWeight: theme.fontWeights.bold,
    fontSize: theme.spacing(2.5)
  },
  rowBottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  stepTagWrapper: {
    borderRadius: 8,
    backgroundColor: theme.palette.orange.light,
    padding: `${theme.spacing(1)}px`
  },
  stepTagWrapperTwo: {
    backgroundColor: theme.palette.red.light
  },
  stepTag: {
    color: theme.palette.orange.dark,
    fontSize: theme.spacing(1.75),
    fontWeight: theme.fontWeights.medium
  },
  stepTagTwo: {
    color: theme.palette.red.main
  },
  tokenAmount: {
    color: theme.palette.grey.dark,
    fontSize: theme.spacing(2),
    fontWeight: theme.fontWeights.medium
  },
  withdraw: {
    display: 'flex',
    alignItems: 'start',
    justifyContent: 'space-between',
    flexDirection: 'column',
    borderTop: `1px solid ${theme.palette.grey.dark}`,
    paddingTop: theme.spacing(1.5),
    marginTop: theme.spacing(2.5),
    marginBottom: -theme.spacing(0.5)
  },
  withdrawInfo: {
    display: 'flex',
    width: '100%',
    color: theme.palette.grey.dark
  },
  withdrawInfoDelayed: {
    flexDirection: 'column',
    color: theme.palette.white,
    padding: `${theme.spacing(3.5)}px ${theme.spacing(3)}px`,
    backgroundColor: theme.palette.grey.dark05,
    borderRadius: 12
  },
  withdrawInfoIcon: {
    color: theme.palette.white
  },
  infoIcon: {
    width: theme.spacing(2),
    height: theme.spacing(2),
    marginRight: theme.spacing(1),
    fill: theme.palette.white
  },
  infoText: {
    marginBottom: theme.spacing(2),
    fontSize: theme.spacing(2),
    fontWeight: theme.fontWeights.medium,
    '&:last-child': {
      marginBottom: 0
    }
  },
  withdrawDelayedButtons: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderTop: `1px solid ${theme.palette.grey.dark}`,
    paddingTop: theme.spacing(2),
    marginTop: theme.spacing(2),
    '& > button': {
      width: theme.spacing(34),
      marginLeft: 0
    },
    '& > button:first-child': {
      marginBottom: theme.spacing(1.5),
      [theme.breakpoints.upSm]: {
        marginBottom: 0
      }
    },
    [theme.breakpoints.upSm]: {
      flexDirection: 'row'
    }
  },
  withdrawButton: {
    marginLeft: 'auto',
    cursor: 'pointer',
    border: 0,
    outline: 'none',
    borderRadius: 100,
    backgroundColor: theme.palette.secondary.main,
    padding: `${theme.spacing(1.5)}px ${theme.spacing(4)}px`,
    color: theme.palette.white,
    fontSize: theme.spacing(2),
    fontWeight: theme.fontWeights.bold
  },
  withdrawDelayerButton: {
    marginLeft: 0,
    backgroundColor: theme.palette.grey.dark05
  }
}))

export default useExitStyles
