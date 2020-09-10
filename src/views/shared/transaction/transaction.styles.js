import { createUseStyles } from 'react-jss'

const useAccountListStyles = createUseStyles({
  token: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F3F8',
    borderRadius: 16,
    height: 80,
    marginBottom: 48,
    padding: '30px 40px',
    cursor: 'pointer',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black'
  }
})

export default useAccountListStyles
