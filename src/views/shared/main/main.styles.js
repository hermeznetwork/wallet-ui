import { createUseStyles } from 'react-jss'

const useMainStyles = createUseStyles({
  main: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& > *': {
      width: '100%'
    }
  }
})

export default useMainStyles
