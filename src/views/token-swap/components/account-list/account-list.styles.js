
import { createUseStyles } from 'react-jss'

const useAccountListStyles = createUseStyles(theme => ({
  listBox: {
    overflow: 'auto',
    borderTop: `1px ${theme.palette.grey.veryLight} solid`,
    padding: theme.spacing(2)
  },
  tokenBox: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: theme.palette.grey.light,
    borderRadius: theme.spacing(1.5),
    padding: `${theme.spacing(2)}px ${theme.spacing(2.5)}px`,
    alignContent: 'flex-end',
    '&:not(:first-of-type)': {
      marginTop: theme.spacing(2)
    },
    cursor: 'pointer'
  },
  tokenIcon: {
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1),
    '& svg': {
      width: theme.spacing(2.5),
      [theme.breakpoints.upSm]: {
        width: theme.spacing(4)
      }
    }
  },
  tokenText: {
    flex: '1',
    fontWeight: theme.fontWeights.bold,
    [theme.breakpoints.upSm]: {
      fontText: theme.spacing(2)
    }
  },
  balanceText: {
    fontSize: theme.spacing(1.75),
    fontWeight: theme.fontWeights.medium
  },
  symbol: {
    fontSize: theme.spacing(1.75),
    fontWeight: theme.fontWeights.medium,
    color: theme.palette.grey.main,
    marginTop: theme.spacing(0.5)
  }
}
))

export default useAccountListStyles
