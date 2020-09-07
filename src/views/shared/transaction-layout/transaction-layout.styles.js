import { createUseStyles } from 'react-jss'

const useTransactionLayoutStyles = createUseStyles({
  wrapper: {
    maxWidth: 700,
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
    marginTop: 32,
    marginBottom: 80
  },
  heading: {
    fontSize: 24,
    lineHeight: '24px',
    fontWeight: 800
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    width: 20,
    height: 20,
    lineHeight: '20px',
    textAlign: 'center',
    color: 'black',
    textDecoration: 'none'
  }
})

export default useTransactionLayoutStyles
