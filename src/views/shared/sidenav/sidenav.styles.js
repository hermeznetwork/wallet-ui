import { createUseStyles } from 'react-jss'

const useSidenavStyles = createUseStyles((theme) => ({
  root: {
    display: 'flex',
    minHeight: '100vh',
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
    overflow: 'hidden',
    boxShadow: '-5px 0 30px 0 rgba(136, 139, 170, 0.15)',
    background: theme.palette.white,
    borderRadius: `${theme.spacing(4)}px 0 0 ${theme.spacing(4)}px`
  },
  content: {
    padding: theme.spacing(3),
    overflowY: 'auto'
  },
  hideButton: {
    fontSize: theme.spacing(1.75),
    fontWeight: theme.fontWeights.bold,
    appearance: 'none',
    border: 0,
    cursor: 'pointer',
    background: theme.palette.grey.light,
    borderRadius: theme.spacing(12.5),
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    marginBottom: theme.spacing(2),
    [theme.breakpoints.upSm]: {
      fontSize: theme.spacing(2)
    }
  },
  hideButtonIcon: {
    [theme.breakpoints.upSm]: {
      width: theme.spacing(1.75),
      marginLeft: theme.spacing(0.75)
    },
    width: theme.spacing(1.5),
    marginLeft: theme.spacing(0.5),
    transform: 'rotate(-90deg)',
    '& path': {
      fill: theme.palette.black
    }
  }
}))

export default useSidenavStyles
