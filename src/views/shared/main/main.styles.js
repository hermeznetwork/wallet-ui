import { createUseStyles } from 'react-jss'

const useMainStyles = createUseStyles(theme => ({
  main: {
    width: '100%',
    marginTop: theme.spacing(9)
  }
}))

export default useMainStyles
