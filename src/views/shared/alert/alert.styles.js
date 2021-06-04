import { createUseStyles } from 'react-jss'

const useAlertStyles = createUseStyles((theme) => ({
  root: {
    width: '100%',
    fontSize: theme.spacing(1.75),
    background: theme.palette.black,
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  icon: {
    marginRight: theme.spacing(1),
    '& path': {
      fill: theme.palette.white
    }
  },
  messageWrapper: {
    display: 'flex',
    alignItems: 'flex-start'
  },
  message: {
    fontWeight: theme.fontWeights.medium,
    color: theme.palette.white,
    lineHeight: 1.57
  },
  helpButton: {
    fontWeight: theme.fontWeights.medium,
    appearance: 'none',
    border: 0,
    borderRadius: theme.spacing(2),
    cursor: 'pointer',
    background: theme.palette.grey.dark05,
    color: theme.palette.white,
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
    '&:hover': {
      background: theme.palette.grey.hover
    }
  }
}))

export default useAlertStyles
