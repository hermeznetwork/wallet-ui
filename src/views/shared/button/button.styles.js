import { createUseStyles } from 'react-jss'

const useButtonStyles = createUseStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    border: 'none',
    width: 'fit-content',
    marginTop: theme.spacing(2),
    margin: 'auto',
    padding: ({ rounded }) => rounded
      ? theme.spacing(2)
      : `${theme.spacing(1.5)}px ${theme.spacing(2.5)}px`,
    borderRadius: ({ rounded }) => rounded
      ? '50%'
      : 50,
    background: theme.palette.primary.dark,
    color: theme.palette.grey.dark,
    cursor: 'pointer',
    fontWeight: theme.fontWeights.medium,
    transition: theme.hoverTransition,
    '&:hover:not(:disabled)': {
      background: theme.palette.primary.hover
    },
    '&:focus': {
      outline: 'none'
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'default'
    }
  },
  textSpacer: {
    marginLeft: theme.spacing(1)
  }
}))

export default useButtonStyles
