import { createUseStyles } from 'react-jss'

const useTransactionStyles = createUseStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: 'currentColor'
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

export default useTransactionStyles
