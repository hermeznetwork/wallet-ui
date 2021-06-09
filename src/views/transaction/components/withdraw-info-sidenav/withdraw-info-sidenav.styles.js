import { createUseStyles } from 'react-jss'

const useWithdrawInfoSidenavStyles = createUseStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  title: {
    fontSize: theme.spacing(1.75),
    fontWeight: theme.fontWeights.medium,
    color: theme.palette.grey.main,
    lineHeight: 1.57,
    marginTop: theme.spacing(2)
  },
  stepCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    background: theme.palette.grey.light,
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2.5),
    marginTop: theme.spacing(2),
    color: theme.palette.black,
    fontSize: theme.spacing(1.75),
    fontWeight: theme.fontWeights.medium
  },
  step: {
    borderRadius: theme.spacing(2),
    background: theme.palette.white,
    padding: `${theme.spacing(0.75)}px ${theme.spacing(1.5)}px`,
    marginBottom: theme.spacing(1.5)
  },
  stepName: {
    color: theme.palette.grey.main
  },
  stepDescription: {
    lineHeight: 1.57
  }
}))

export default useWithdrawInfoSidenavStyles
