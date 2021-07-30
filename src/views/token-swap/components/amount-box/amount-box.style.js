import { createUseStyles } from 'react-jss'

const useAmountBoxStyles = createUseStyles(theme => ({
  box: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: theme.spacing(2),
    height: theme.spacing(11),
    [theme.breakpoints.upSm]: {
      height: theme.spacing(13)
    },
    backgroundColor: theme.palette.grey.light,
    padding: theme.spacing(1.5)
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.upSm]: {
      paddingRight: theme.spacing(1.5)
    },
    position: 'relative'
  },
  rowMarginTop: {
    marginTop: theme.spacing(1)
  },
  selectorBox: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: theme.palette.white,
    borderRadius: theme.spacing(2),
    paddingLeft: theme.spacing(1.5),
    fontSize: theme.spacing(2),
    padding: theme.spacing(1),
    height: theme.spacing(4.5),
    [theme.breakpoints.upSm]: {
      fontSize: theme.spacing(2.5),
      padding: theme.spacing(2),
      height: theme.spacing(6)
    },
    fontWeight: theme.fontWeights.bold,
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  },
  tokenName: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  tokenIcon: {
    marginRight: theme.spacing(1),
    width: theme.spacing(2.5),
    [theme.breakpoints.upSm]: {
      width: theme.spacing(4)
    }
  },
  angleColor: {
    marginLeft: theme.spacing(1),
    width: theme.spacing(1.5),
    [theme.breakpoints.upSm]: {
      width: theme.spacing(2)
    },
    '& path': {
      fill: theme.palette.black
    }
  },
  amountInput: {
    fontSize: theme.spacing(3),
    [theme.breakpoints.upSm]: {
      fontSize: theme.spacing(5)
    },
    fontWeight: theme.fontWeights.bold,
    textAlign: 'right',
    background: 'none',
    border: 'none',
    width: '100%',
    '&:focus-visible': {
      outline: 'none'
    }
  },
  convertedText: {
    fontSize: theme.spacing(1.75),
    [theme.breakpoints.upSm]: {
      fontSize: theme.spacing(2)
    },
    fontWeight: theme.fontWeights.medium,
    color: theme.palette.grey.main
  },
  maxBtn: {
    color: theme.palette.black
  },
  frame: {
    position: 'relative'
  }
}))

export default useAmountBoxStyles
