import { createUseStyles } from 'react-jss'

const useCoinBalanceStyles = createUseStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    background: 'gainsboro',
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
  baseCurrency: {
    margin: 0,
    marginBottom: 8
  },
  preferredCurrency: {
    margin: 0
  }
})

export default useCoinBalanceStyles
