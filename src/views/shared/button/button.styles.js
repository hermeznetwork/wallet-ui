import { createUseStyles } from 'react-jss'

const useButtonStyles = createUseStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    border: 'none',
    width: 'fit-content',
    margin: `${theme.spacing(2)} auto 0 auto`,
    padding: ({ rounded }) => rounded
      ? theme.spacing(2)
      : `${theme.spacing(1.5)}px ${theme.spacing(2.5)}px`,
    borderRadius: ({ rounded }) => rounded
      ? '50%'
      : 50,
    background: theme.palette.primary.dark,
    color: theme.palette.grey.dark,
    fontWeight: theme.fontWeights.medium,
    transition: theme.hoverTransition,
    '&:focus': {
      outline: 'none'
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'default'
    }
  },
  button: {
    cursor: 'pointer',
    '&:hover:not(:disabled)': {
      background: theme.palette.primary.hover
    }
  },
  textSpacer: {
    marginLeft: theme.spacing(1)
  }
}))

export default useButtonStyles
