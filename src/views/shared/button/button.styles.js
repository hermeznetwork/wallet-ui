import { createUseStyles } from 'react-jss'

const useButtonStyles = createUseStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    border: 'none',
    width: 'fit-content',
    marginTop: theme.spacing(2),
    margin: 'auto',
    padding: `${theme.spacing(1.5)}px ${theme.spacing(2.5)}px`,
    borderRadius: 50,
    background: theme.palette.primary.dark,
    color: theme.palette.grey.dark,
    cursor: 'pointer',
    fontWeight: theme.fontWeights.medium,
    '&:focus': {
      outline: 'none'
    }
  },
  textSpacer: {
    marginLeft: theme.spacing(1)
  }
}))

export default useButtonStyles
