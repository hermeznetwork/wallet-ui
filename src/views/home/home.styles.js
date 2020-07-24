import { createUseStyles } from 'react-jss'

const useHomeStyles = createUseStyles({
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
  }
})

export default useHomeStyles
