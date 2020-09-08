import { createUseStyles } from 'react-jss'

const useAccountListStyles = createUseStyles({
  tokenListItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#F3F3F8',
    borderRadius: '16px',
    height: 96,
    marginBottom: 20,
    padding: 24
  },
  values: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontWeight: 500
  },
  fiatValues: {
    fontSize: 20,
    lineHeight: '20px',
    color: 'black',
    marginBottom: 12
  },
  tokenValues: {
    fontSize: 16,
    lineHeight: '16px',
    color: '#888BAA'
  }
})

export default useAccountListStyles
