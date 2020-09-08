import { createUseStyles } from 'react-jss'

const useAppStyles = createUseStyles({
  '@global': {
    '*': {
      boxSizing: 'border-box'
    }
  }
})

export default useAppStyles
