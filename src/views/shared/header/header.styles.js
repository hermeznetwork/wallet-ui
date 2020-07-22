import { createUseStyles } from 'react-jss'

const useHeaderStyles = createUseStyles({
  navbar: {
    listStyle: 'none',
    paddingLeft: 0,
    display: 'flex',
    justifyContent: 'space-around'
  },
  navbarItem: {
    display: 'flex'
  },
  navbarLink: {
    padding: '8px 16px',
    textDecoration: 'none',
    color: 'black',
    borderRadius: 8
  },
  activeNavbarLink: {
    background: 'gainsboro'
  }
})

export default useHeaderStyles
