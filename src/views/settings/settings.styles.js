import { createUseStyles } from 'react-jss'

const useSettingsStyles = createUseStyles({
  settingsWrapper: {
    width: '100%'
  },
  title: {
    marginBottom: 16
  },
  ethereumAddress: {
    fontWeight: 'bold',
    marginBottom: 16
  },
  preferredCurrency: {
    marginBottom: 16
  },
  qrCode: {
    width: '100% !important',
    // important added in order to be able to overwrite inner styles and be
    // able to fit its own container completely
    height: '100% !important'
  }
})

export default useSettingsStyles
