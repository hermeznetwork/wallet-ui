import { createUseStyles } from 'react-jss'

const useDropdrownpStyles = createUseStyles(theme => ({
  dropDown: {
    position: 'absolute',
    backgroundColor: theme.palette.white,
    display: 'flex',
    flexDirection: 'column',
    width: window.innerWidth - theme.spacing(0.5),
    marginLeft: theme.spacing(-5),
    top: theme.spacing(4.5),
    [theme.breakpoints.upSm]: {
      width: '75%',
      marginLeft: 0,
      top: theme.spacing(6)
    },
    zIndex: '10',
    marginTop: theme.spacing(1),
    border: '1px solid ' + theme.palette.grey.veryLight,
    borderRadius: theme.spacing(2.5),
    boxShadow: '1px 1px'
  },
  searchRow: {
    padding: theme.spacing(2)
  },
  searchBox: {
    border: '1px solid ' + theme.palette.grey.veryLight,
    width: '100%',
    height: theme.spacing(5),
    borderRadius: theme.spacing(1.5),
    display: 'flex',
    justifyContent: 'space-between',
    overflow: 'hidden',
    paddingLeft: theme.spacing(1.5)
  },
  searchIcon: {
    borderLeft: '1px solid ' + theme.palette.grey.veryLight,
    backgroundColor: theme.palette.grey.light,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: theme.spacing(5),
    height: '100%',
    borderRadius: theme.spacing(1.5),
    boxSizing: 'content-box'
  },
  searchInput: {
    background: 'none',
    border: 'none',
    flex: '1',
    '&:focus-visible': {
      outline: 'none'
    }
  },
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
}))

export default useDropdrownpStyles
