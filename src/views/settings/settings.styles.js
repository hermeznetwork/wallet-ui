import { createUseStyles } from 'react-jss'

const useSettingsStyles = createUseStyles({
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
  qrWrapper: {
    width: '222px',
    // 222 a random number added for testing purposes until design is delivered
    height: '222px'
  },
  qrCanvas: {
    width: '100% !important',
    // important added in order to be able to overwrite inner styles and be
    // able to fit its own container completely
    height: '100% !important'
  }
})

export default useSettingsStyles
