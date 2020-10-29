import { createUseStyles } from 'react-jss'

const useFiatAmountStyles = createUseStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'center'
  },
  amount: ({ size }) => ({
    margin: 0,
    fontSize: `${theme.spacing(5)}px`
  }),
  currency: {
    margin: 0,
    marginLeft: 8
  }
}))

export default useFiatAmountStyles
