import { createUseStyles } from 'react-jss'

const useAccountListStyles = createUseStyles(theme => ({
  root: {
    width: '100%'
  },
  accountSpacer: {
    marginTop: theme.spacing(2.5)
  }
}))

export default useAccountListStyles
