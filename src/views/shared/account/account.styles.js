import { createUseStyles } from 'react-jss'

const useAccountStyles = createUseStyles(theme => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: theme.palette.grey.light,
    borderRadius: theme.spacing(1),
    padding: `${theme.spacing(2.5)}px ${theme.spacing(3)}px`,
    cursor: 'pointer',
    [theme.breakpoints.upSm]: {
      padding: `${theme.spacing(3.5)}px ${theme.spacing(5)}px`
    }
  },
  values: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  topRow: {
    color: theme.palette.black,
    fontSize: theme.spacing(2),
    marginBottom: theme.spacing(1.5),
    [theme.breakpoints.upSm]: {
      fontSize: theme.spacing(2.5)
    }
  },
  tokenName: {
    fontWeight: theme.fontWeights.bold
  },
  bottomRow: {
    color: theme.palette.grey.main
  }
}))

export default useAccountStyles
