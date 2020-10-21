import { createUseStyles } from 'react-jss'

const useTokenBalance = createUseStyles(theme => ({
  root: {
    textAlign: 'center',
    fontSize: theme.spacing(2.5),
    fontWeight: theme.fontWeights.medium,
    color: theme.palette.grey.dark
  }
}))

export default useTokenBalance
