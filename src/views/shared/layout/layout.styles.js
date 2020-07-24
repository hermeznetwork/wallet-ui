import { createUseStyles } from 'react-jss'

const useLayoutStyles = createUseStyles(theme => ({
  root: {
    margin: '0 16px',
    [theme.breakpoints.md]: {
      maxWidth: 700,
      width: '100%',
      margin: '0 auto'
    }
  }
}))

export default useLayoutStyles
