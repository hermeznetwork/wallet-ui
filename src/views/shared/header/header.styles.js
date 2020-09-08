import { createUseStyles } from 'react-jss'

const useHeaderStyles = createUseStyles({
  root: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%'
  },
  headerContent: {
    maxWidth: 700,
    width: '100%',
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
