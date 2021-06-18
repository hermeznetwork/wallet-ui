import { createUseStyles } from 'react-jss'
import { AlertVariant } from './alert.view'

const useAlertStyles = createUseStyles((theme) => ({
  root: ({ variant }) => ({
    width: '100%',
    fontSize: theme.spacing(1.75),
    background: variant === AlertVariant.LIGHT ? theme.palette.white : theme.palette.black,
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }),
  icon: ({ variant }) => ({
    flexShrink: 0,
    width: theme.spacing(2),
    marginRight: theme.spacing(1),
    '& path': {
      fill: variant === AlertVariant.LIGHT ? theme.palette.grey.dark : theme.palette.white
    }
  }),
  messageWrapper: {
    display: 'flex',
    alignItems: 'flex-start'
  },
  message: ({ variant }) => ({
    fontWeight: theme.fontWeights.medium,
    color: variant === AlertVariant.LIGHT ? theme.palette.grey.dark : theme.palette.white,
    lineHeight: 1.57
  }),
  helpButton: {
    fontWeight: theme.fontWeights.medium,
    appearance: 'none',
    border: 0,
    borderRadius: theme.spacing(2),
    cursor: 'pointer',
    background: theme.palette.grey.dark05,
    color: theme.palette.white,
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
    whiteSpace: 'nowrap',
    marginLeft: theme.spacing(12.5),
    '&:hover': {
      background: theme.palette.grey.hover
    }
  }
}))

export default useAlertStyles
