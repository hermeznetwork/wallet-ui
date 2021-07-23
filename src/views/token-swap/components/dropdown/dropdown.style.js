import { createUseStyles } from 'react-jss'

const useDropdrownpStyles = createUseStyles(theme => ({
  dropDown: {
    position: 'absolute',
    backgroundColor: theme.palette.white,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: theme.spacing(50),
    zIndex: '10',
    marginTop: theme.spacing(-2),
    border: '1px solid ' + theme.palette.grey.veryLight,
    borderEndEndRadius: theme.spacing(2.5),
    borderEndStartRadius: theme.spacing(2.5),
    padding: theme.spacing(4),
    paddingTop: theme.spacing(7)
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
  tokenBox: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: theme.palette.grey.light,
    borderRadius: theme.spacing(1.5),
    padding: `${theme.spacing(2)}px ${theme.spacing(2.5)}px`,
    marginTop: theme.spacing(2),
    alignContent: 'flex-end'
  },
  tokenIcon: {
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1)
  },
  tokenText: {
    flex: '1'
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
