import { createUseStyles } from 'react-jss'

const useFiatAmountStyles = createUseStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'center',
    color: theme.palette.grey.dark
  },
  currency: {
    margin: 0,
    marginLeft: 8
  }
}))

export default useFiatAmountStyles
