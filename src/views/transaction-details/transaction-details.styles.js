const { createUseStyles } = require('react-jss')

const useTransactionDetailsStyles = createUseStyles({
  root: {
    width: '100%'
  },
  closeButton: {
    display: 'flex',
    marginLeft: 'auto',
    marginBottom: 16
  },
  statusContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'gainsboro',
    borderRadius: 8,
    padding: 32
  },
  transactionInfoContainer: {
    marginTop: 16,
    padding: 32,
    border: '2px solid gainsboro',
    borderRadius: 8
  },
  transactionInfoList: {
    listStyle: 'none',
    paddingLeft: 0
  },
  transactionInfoListItem: {
    display: 'flex',
    padding: 16,
    borderTop: '1px solid gainsboro'
  },
  transactionInfoListItemTitle: {
    width: '20%'
  }
})

export default useTransactionDetailsStyles
