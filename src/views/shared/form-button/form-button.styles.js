import { createUseStyles } from 'react-jss'

const useFormButtonStyles = createUseStyles(theme => ({
  root: {
    cursor: 'pointer',
    width: '100%',
    marginTop: theme.spacing(8),
    padding: `${theme.spacing(2)}px 0`,
    backgroundColor: theme.palette.secondary.main,
    border: 0,
    outline: 'none',
    borderRadius: 14,
    fontSize: `${theme.spacing(2)}px`,
    fontWeight: theme.fontWeights.bold,
    color: theme.palette.white,
    '&[disabled]': {
      backgroundColor: theme.palette.grey.main,
      cursor: 'default'
    },
    [theme.breakpoints.upSm]: {
      fontSize: `${theme.spacing(3)}px`,
      padding: `${theme.spacing(3)}px 0`,
      marginTop: theme.spacing(14.5)
    }
  }
}))

export default useFormButtonStyles
