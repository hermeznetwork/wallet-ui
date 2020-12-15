import { createUseStyles } from 'react-jss'

const useHomeStyles = createUseStyles(theme => ({
  root: {
    width: '100%'
  },
  section: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  hermezAddress: {
    width: 'fit-content',
    marginTop: theme.spacing(2),
    margin: 'auto',
    padding: `${theme.spacing(1.5)}px ${theme.spacing(2.5)}px`,
    borderRadius: 50,
    background: theme.palette.primary.dark,
    color: theme.palette.grey.dark,
    cursor: 'pointer',
    fontWeight: theme.fontWeights.medium
  },
  accountBalance: {
    marginTop: `${theme.spacing(4)}px`,
    marginBottom: `${theme.spacing(3)}px`
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
  test: {
    width: '222px', // random number added for testing purposes until design is delivered
    height: '222px'
  },
  testCanvas: {
    width: '100% !important',
    height: '100% !important'
  }
}))

export default useHomeStyles
