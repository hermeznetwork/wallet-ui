import { createUseStyles } from 'react-jss'

const accountSelectorFormStyles = createUseStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },
  select: {
    appearance: 'none',
    fontSize: theme.spacing(3),
    fontWeight: theme.fontWeights.medium,
    background: theme.palette.white,
    padding: `${theme.spacing(3)}px ${theme.spacing(5)}px`,
    borderRadius: 18,
    border: `2px solid ${theme.palette.grey.veryLight}`,
    color: theme.palette.black,
    outline: 'none',
    cursor: 'pointer',
    transition: theme.hoverTransition,
    '&:not(:first-of-type)': {
      marginTop: theme.spacing(6)
    }
  },
  button: {
    marginTop: theme.spacing(12)
  },
  helperSection: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1.5),
    marginLeft: theme.spacing(0.5)
  },
  helperIcon: {
    marginRight: theme.spacing(1),
    width: 20,
    height: 20,
    '& path': {
      fill: theme.palette.grey.dark
    }
  },
  helperText: {
    color: theme.palette.grey.dark,
    fontWeight: theme.fontWeights.medium
  }
}))

export default accountSelectorFormStyles
