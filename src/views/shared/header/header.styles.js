import { createUseStyles } from 'react-jss'

const useHeaderStyles = createUseStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  logo: {
    textDecoration: 'none',
    color: 'currentColor'
  }
})

export default useHeaderStyles
