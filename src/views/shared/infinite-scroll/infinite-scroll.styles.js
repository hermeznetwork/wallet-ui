import { createUseStyles } from 'react-jss'

const useInfiniteScrollStyles = createUseStyles(theme => ({
  root: {
    width: '100%'
  },
  spinnerWrapper: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing(3)
  }
}))

export default useInfiniteScrollStyles
