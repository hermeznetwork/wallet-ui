import { createUseStyles } from 'react-jss'

const useTokenSwapStyles = createUseStyles(theme => ({
  box: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: theme.spacing(2.5),
    border: '2px solid ' + theme.palette.grey.veryLight,
    height: theme.spacing(13),
    backgroundColor: theme.palette.grey.light,
    padding: theme.spacing(1.5),
    marginBottom: theme.spacing(1)
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
    fontWeight: theme.fontWeights.bold
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
  }
}))

export default useTokenSwapStyles
