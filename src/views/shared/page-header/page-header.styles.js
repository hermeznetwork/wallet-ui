import { createUseStyles } from 'react-jss'

const usePageHeaderStyles = createUseStyles(theme => ({
  root: {
    width: '100%',
    position: 'absolute',
    height: theme.headerHeight,
    display: 'flex',
    alignItems: 'center',
    zIndex: 999,
    background: 'transparent'
  },
  headerContent: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: theme.spacing(3)
  },
  buttonBase: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    cursor: 'pointer',
    border: 'none',
    background: 'transparent',
    outline: 'none'
  },
  goBackButton: {
    left: 0,
    marginLeft: -(theme.spacing(2))
  },
  closeButton: {
    right: 0,
    marginRight: -(theme.spacing(2))
  },
  titleWrapper: {
    textAlign: 'center'
  },
  title: {
    fontSize: theme.spacing(3),
    fontWeight: theme.fontWeights.extraBold
  },
  subtitle: {
    fontSize: theme.spacing(2),
    fontWeight: theme.fontWeights.medium,
    color: theme.palette.grey.dark,
    paddingTop: theme.spacing(1.5),
    margin: 0
  }
}))

export default usePageHeaderStyles
