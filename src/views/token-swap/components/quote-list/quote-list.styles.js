import { createUseStyles } from 'react-jss'

const useQuoteListStyles = createUseStyles((theme) => ({
  root: {
    width: '100%'
  },
  quote: {
    '&:not(:first-of-type)': {
      marginTop: theme.spacing(2)
    }
  }
}))

export default useQuoteListStyles
