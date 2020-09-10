import { createUseStyles } from 'react-jss'

const useAccountListStyles = createUseStyles(theme => ({
  account: {
    width: '100%'
  },
  accountSpacer: {
    marginTop: theme.spacing(2.5)
  }
}))

export default useAccountListStyles
