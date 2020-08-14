import { createUseStyles } from 'react-jss'

const useTokenStyles = createUseStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    background: 'gainsboro',
    borderRadius: 8,
    padding: 24,
    marginTop: 16
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
  symbol: {
    margin: 0,
    marginBottom: 8
  },
  preferredCurrency: {
    margin: 0
  }
})

export default useTokenStyles
