import { createUseStyles } from 'react-jss'

const usePrivateLayoutStyles = createUseStyles({
  root: {
    flex: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  main: {
    flex: 1,
    display: 'flex',
    width: '100%'
  }
})

export default usePrivateLayoutStyles
