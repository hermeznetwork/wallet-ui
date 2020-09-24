const { createUseStyles } = require('react-jss')

const usePreferredCurrencySelectorStyles = createUseStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center'
  },
  inputGroupSpacer: {
    marginLeft: theme.spacing(3.5)
  },
  input: {
    marginRight: theme.spacing(1)
  },
  label: {
    fontWeight: theme.fontWeights.medium
  }
}))

export default usePreferredCurrencySelectorStyles
