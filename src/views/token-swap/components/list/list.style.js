
import { createUseStyles } from 'react-jss'

const useListStyles = createUseStyles(theme => ({
  listBox: {
    borderTop: `1px ${theme.palette.grey.veryLight} solid`,
    padding: theme.spacing(2)
  },
  tokenBox: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: theme.palette.grey.light,
    borderRadius: theme.spacing(1.5),
    padding: `${theme.spacing(2)}px ${theme.spacing(2.5)}px`,
    marginBottom: theme.spacing(2),
    alignContent: 'flex-end'
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
    fontSize: theme.spacing(1.75),
    [theme.breakpoints.upSm]: {
      fontText: theme.spacing(2)
    }
  },
  balanceText: {
    fontSize: theme.spacing(1.75)
  },
  symbol: {
    fontSize: theme.spacing(1.75),
    color: theme.palette.grey.main
  }
}
))

export default useListStyles
