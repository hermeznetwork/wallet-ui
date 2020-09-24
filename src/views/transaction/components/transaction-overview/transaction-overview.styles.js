import { createUseStyles } from 'react-jss'

const useTransactionOverviewStyles = createUseStyles(theme => ({
  wrapper: {
    width: '100%'
  },
  amountWrapper: {
    position: 'fixed',
    left: 0,
    top: `${theme.spacing(6.5)}px`,
    width: '100vw',
    background: theme.palette.primary.main,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: `${theme.spacing(4.5)}px`,
    paddingBottom: `${theme.spacing(7)}px`
  },
  amountFiat: {
    fontSize: `${theme.spacing(5)}px`,
    lineHeight: `${theme.spacing(5)}px`,
    color: theme.palette.black.light,
    fontWeight: theme.fontWeights.extraBold,
    marginBottom: `${theme.spacing(1)}px`
  },
  amountToken: {
    fontSize: `${theme.spacing(2.5)}px`,
    lineHeight: `${theme.spacing(2.5)}px`,
    color: theme.palette.grey.dark,
    fontWeight: theme.fontWeights.medium
  },
  txTable: {
    marginTop: `${theme.spacing(29.5)}px`,
    padding: `0 ${theme.spacing(4.5)}px`
  },
  row: {
    height: `${theme.spacing(12)}px`,
    padding: `${theme.spacing(3.5)}px 0 ${theme.spacing(3)}px`,
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${theme.palette.grey.veryLight}`
  },
  rowName: {
    fontSize: `${theme.spacing(2)}px`,
    color: theme.palette.black.dark,
    fontWeight: theme.fontWeights.medium
  },
  rowValues: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  valueTop: {
    fontSize: `${theme.spacing(2)}px`,
    color: theme.palette.black.dark,
    fontWeight: theme.fontWeights.bold,
    marginBottom: `${theme.spacing(1.5)}px`
  },
  valueBottom: {
    fontSize: `${theme.spacing(2)}px`,
    color: theme.palette.grey.main,
    fontWeight: theme.fontWeights.medium
  },
  txButton: {
    width: '100%',
    fontSize: `${theme.spacing(3)}px`,
    fontWeight: theme.fontWeights.bold,
    color: theme.palette.white,
    padding: `${theme.spacing(3.5)}px 0`,
    backgroundColor: theme.palette.secondary,
    borderRadius: 20,
    border: 0,
    marginBottom: `${theme.spacing(5)}px`,
    cursor: 'pointer'
  }
}))

export default useTransactionOverviewStyles
