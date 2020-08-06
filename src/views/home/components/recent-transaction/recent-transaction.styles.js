import { createUseStyles } from 'react-jss'

const useRecentTransactionStyles = createUseStyles({
  root: {
    display: 'flex',
    alignItems: 'center'
  },
  typeContainer: {
    marginRight: 24,
    background: 'gainsboro',
    borderRadius: 8
  },
  type: {
    margin: 0,
    padding: '8px 16px'
  },
  amount: {
    margin: 0,
    marginBottom: 8
  },
  date: {
    margin: 0,
    color: 'grey'
  }
})

export default useRecentTransactionStyles
