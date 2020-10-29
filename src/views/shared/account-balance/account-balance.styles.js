import { createUseStyles } from 'react-jss'

const useAccountBalanceStyles = createUseStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'center'
  },
  amount: ({ size }) => ({
    margin: 0,
    fontSize: size === 'big'
      ? `${theme.spacing(5)}px`
      : `${theme.spacing(4)}px`
  }),
  currency: {
    margin: 0,
    marginLeft: 8
  }
}))

export default useAccountBalanceStyles
