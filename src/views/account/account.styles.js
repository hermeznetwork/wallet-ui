import { createUseStyles } from 'react-jss'

const useHomeStyles = createUseStyles({
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
    width: '222px', // random number added for testing purposes until design is delivered
    height: '222px'
  },
  qrCanvas: {
    width: '100% !important',
    height: '100% !important'
  }
})

export default useHomeStyles
