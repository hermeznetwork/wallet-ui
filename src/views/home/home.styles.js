import { createUseStyles } from 'react-jss'

const useHomeStyles = createUseStyles({
  homeWrapper: {
    width: '100%'
  },
  title: {
    marginBottom: 16
  },
  actionButtonsGroup: {
    marginTop: 16,
    display: 'flex',
    justifyContent: 'space-between'
  },
  actionButton: {
    appearance: 'none',
    padding: '8px 16px',
    border: '1px solid gainsboro',
    background: 'transparent',
    borderRadius: 8,
    cursor: 'pointer',
    flex: '0 0 48%'
  },
  test: {
    width: '222px', // random number added for testing purposes until design is delivered
    height: '222px'
  },
  testCanvas: {
    width: '100% !important',
    height: '100% !important'
  }
})

export default useHomeStyles
