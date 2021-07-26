import { createUseStyles } from 'react-jss'

const useAmountBoxStyles = createUseStyles(theme => ({
  box: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: theme.spacing(2.5),
    border: '2px solid ' + theme.palette.grey.veryLight,
    height: theme.spacing(13),
    backgroundColor: theme.palette.grey.light,
    padding: theme.spacing(1.5),
    position: 'relative',
    zIndex: '20'
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingRight: theme.spacing(1.5)
  },
  rowMarginTop: {
    marginTop: theme.spacing(1)
  },
  selectorBox: {
    display: 'flex',
    alignItems: 'center',
    height: theme.spacing(6),
    backgroundColor: theme.palette.white,
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
    fontSize: theme.spacing(2.5),
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
    marginRight: theme.spacing(1)
  },
  angleColor: {
    marginLeft: theme.spacing(1),
    '& path': {
      fill: theme.palette.black
    }
  },
  amountInput: {
    fontSize: theme.spacing(5),
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
    fontSize: theme.spacing(2),
    fontWeight: theme.fontWeights.medium,
    color: theme.palette.grey.main
  },
  maxBtn: {
    color: theme.palette.black
  },
  frame: {
    position: 'relative'
  },
  dropDown: {
    position: 'absolute',
    backgroundColor: theme.palette.white,
    display: 'flex',
    width: '100%',
    height: theme.spacing(50),
    zIndex: '10',
    marginTop: theme.spacing(-2),
    border: '2px solid ' + theme.palette.grey.veryLight,
    borderEndEndRadius: theme.spacing(2.5),
    borderEndStartRadius: theme.spacing(2.5)
  }
}))

export default useAmountBoxStyles
