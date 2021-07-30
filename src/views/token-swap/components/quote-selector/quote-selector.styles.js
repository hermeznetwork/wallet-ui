import { createUseStyles } from 'react-jss'

const useQuoteSelectorStyles = createUseStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    marginTop: theme.spacing(7)
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: theme.fontWeights.medium,
    marginRight: theme.spacing(3),
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(3)
  }
}))

export default useQuoteSelectorStyles
