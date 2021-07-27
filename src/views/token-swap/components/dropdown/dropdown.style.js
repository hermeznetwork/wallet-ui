import { createUseStyles } from 'react-jss'

const useDropdrownpStyles = createUseStyles(theme => ({
  dropDown: {
    position: 'absolute',
    backgroundColor: theme.palette.white,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    top: theme.spacing(6),
    [theme.breakpoints.upSm]: {
      width: '75%',
      marginLeft: 0,
      top: theme.spacing(8),
      left: theme.spacing(1.5)
    },
    zIndex: '10',
    marginTop: theme.spacing(1),
    borderRadius: theme.spacing(2.5),
    boxShadow: '0 3px 15px 1px rgba(225, 225, 241, 0.8)'
  },
  searchRow: {
    padding: theme.spacing(2)
  },
  searchBox: {
    border: '1px solid ' + theme.palette.grey.veryLight,
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
    },
    boxSizing: 'content-box'
  }
}))

export default useDropdrownpStyles
