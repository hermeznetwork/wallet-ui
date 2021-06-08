import { createUseStyles } from 'react-jss'

const useSidenavStyles = createUseStyles((theme) => ({
  root: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: 'flex',
    zIndex: 999,
    position: 'fixed',
    minHeight: '100vh',
    justifyContent: 'flex-end',
    overflow: 'hidden'
  },
  outerSpace: {
    flex: 1
  },
  content: {
    width: theme.sideBarWidth,
    background: theme.palette.white,
    padding: theme.spacing(3),
    borderRadius: `${theme.spacing(4)}px 0 0 ${theme.spacing(4)}px`,
    boxShadow: '-5px 0 30px 0 rgba(136, 139, 170, 0.15)',
    overflowY: 'auto'
  },
  hideButton: {
    fontWeight: theme.fontWeights.bold,
    appearance: 'none',
    border: 0,
    cursor: 'pointer',
    background: theme.palette.grey.light,
    borderRadius: theme.spacing(12.5),
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    marginBottom: theme.spacing(2)
  },
  hideButtonIcon: {
    width: theme.spacing(1.75),
    marginLeft: theme.spacing(0.75),
    transform: 'rotate(-90deg)',
    '& path': {
      fill: theme.palette.black
    }
  }
}))

export default useSidenavStyles
