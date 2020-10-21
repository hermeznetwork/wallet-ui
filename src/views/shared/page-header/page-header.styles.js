import { createUseStyles } from 'react-jss'

const usePageHeaderStyles = createUseStyles(theme => ({
  root: {
    width: '100%',
    position: 'fixed',
    height: theme.headerHeight,
    display: 'flex',
    alignItems: 'center',
    zIndex: 999,
    background: theme.palette.primary.main
  },
  headerContent: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  goBackButton: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    left: 0,
    display: 'flex',
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    marginLeft: -(theme.spacing(2)),
    cursor: 'pointer',
    border: 'none',
    background: 'transparent',
    outline: 'none'
  },
  title: {
    fontSize: theme.spacing(2.5),
    fontWeight: theme.fontWeights.bold
  }
}))

export default usePageHeaderStyles
