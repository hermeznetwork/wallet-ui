import { createUseStyles } from 'react-jss'

const useSettingsStyles = createUseStyles(theme => ({
  root: {
    width: '100%'
  },
  hermezEthereumAddress: {
    fontSize: theme.spacing(2.5),
    fontWeight: theme.fontWeights.medium,
    textAlign: 'center',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2.5)
  },
  topSection: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  bottomSection: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  settingContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(6)
  },
  settingHeader: {
    display: 'flex',
    alignItems: 'center'
  },
  settingTitle: {
    fontWeight: theme.fontWeights.bold,
    marginLeft: theme.spacing(2)
  },
  settingContent: {
    marginTop: theme.spacing(1.75),
    marginLeft: theme.spacing(4.5)
  },
  preferredCurrencySelector: {

  }
}))

export default useSettingsStyles
