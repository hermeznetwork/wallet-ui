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
    alignItems: 'flex-start',
    marginTop: -theme.spacing(2)
  },
  settingContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: `${theme.spacing(3)}px ${theme.spacing(1)}px`,
    marginLeft: `-${theme.spacing(1)}px`,
    background: 'transparent',
    border: 'none',
    '&:not(:first-child)': {
      cursor: 'pointer'
    },
    '&:focus': {
      outline: 'none'
    }
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
  }
}))

export default useSettingsStyles
