import { createUseStyles } from 'react-jss'

const useAccountStyles = createUseStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    background: 'gainsboro',
    textDecoration: 'none',
    color: 'currentColor',
    borderRadius: 8,
    padding: 24
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: 'gray',
    marginRight: 24
  },
  details: {
    display: 'flex',
    flexDirection: 'column'
  },
  amount: {
    margin: 0,
    marginBottom: 8
  },
  preferredCurrency: {
    margin: 0
  }
})

export default useAccountStyles
