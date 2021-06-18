import { createUseStyles } from 'react-jss'

const useRewardsSidenavStyles = createUseStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  panelTitle: {
    [theme.breakpoints.upSm]: {
      fontSize: theme.spacing(3),
      lineHeight: `${theme.spacing(3.5)}px`
    },
    fontSize: theme.spacing(2),
    lineHeight: `${theme.spacing(2.5)}px`,
    fontWeight: theme.fontWeights.bold,
    marginTop: 0,
    marginBottom: theme.spacing(2)
  },
  tokenImage: {
    width: '100%'
  },
  apiNotAvailableError: {
    marginTop: theme.spacing(3),
    fontWeight: theme.fontWeights.bold,
    lineHeight: 1.5
  },
  finishedText: {
    [theme.breakpoints.upSm]: {
      fontSize: theme.spacing(2),
      lineHeight: `${theme.spacing(3)}px`,
      marginTop: theme.spacing(3)
    },
    fontSize: theme.spacing(1.75),
    lineHeight: `${theme.spacing(2.75)}px`,
    fontWeight: theme.fontWeights.bold,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  timeLeft: {
    width: '100%',
    height: theme.spacing(4),
    background: theme.palette.grey.light,
    borderRadius: '100px',
    fontWeight: theme.fontWeights.bold,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3)
  },
  eligibilityCriteriaTitle: {
    fontSize: theme.spacing(1.75),
    color: theme.palette.grey.main,
    fontWeight: theme.fontWeights.medium,
    marginBottom: theme.spacing(0.75)
  },
  eligibilityCriteriaText: {
    [theme.breakpoints.upSm]: {
      lineHeight: `${theme.spacing(3)}px`
    },
    fontWeight: theme.fontWeights.bold,
    lineHeight: `${theme.spacing(2.5)}px`,
    marginBottom: theme.spacing(3)
  },
  eligibleTextWrapper: {
    display: 'flex',
    marginBottom: theme.spacing(3)
  },
  eligibleText: {
    marginLeft: theme.spacing(1),
    fontWeight: theme.fontWeights.bold
  },
  eligibleIcon: {
    width: theme.spacing(2),
    flex: '1 0 auto'
  },
  rewardCard: {
    [theme.breakpoints.upSm]: {
      padding: theme.spacing(3)
    },
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px`,
    background: theme.palette.grey.light,
    borderRadius: theme.spacing(2)
  },
  rewardGroup: {
    display: 'flex',
    flexDirection: 'column',
    '&:not(:first-of-type)': {
      marginTop: theme.spacing(2)
    }
  },
  rewardTitle: {
    fontSize: theme.spacing(1.75),
    color: theme.palette.grey.main,
    fontWeight: theme.fontWeights.medium,
    lineHeight: `${theme.spacing(2.75)}px`,
    marginBottom: theme.spacing(1)
  },
  reward: {
    [theme.breakpoints.upSm]: {
      fontSize: theme.spacing(2.5)
    },
    fontSize: theme.spacing(2),
    fontWeight: theme.fontWeights.bold,
    lineHeight: `${theme.spacing(2.5)}px`
  },
  rewardPercentage: {
    color: theme.palette.green
  },
  infoTextWrapper: {
    display: 'flex',
    marginTop: theme.spacing(3),
    marginBottom: -theme.spacing(1)
  },
  infoText: {
    color: theme.palette.grey.main,
    fontWeight: theme.fontWeights.medium,
    fontSize: theme.spacing(1.75),
    lineHeight: `${theme.spacing(2.25)}px`,
    marginLeft: theme.spacing(1)
  },
  infoIcon: {
    flex: '1 0 auto'
  },
  moreInfoLink: {
    [theme.breakpoints.upSm]: {
      fontSize: theme.spacing(2)
    },
    fontSize: theme.spacing(1.75),
    background: theme.palette.grey.light,
    borderRadius: 100,
    color: theme.palette.grey.main,
    fontWeight: theme.fontWeights.medium,
    padding: `${theme.spacing(1)}px ${theme.spacing(2.5)}px`,
    width: 'fit-content',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(4)
  },
  moreInfoLinkIcon: {
    [theme.breakpoints.upSm]: {
      width: theme.spacing(1.85)
    },
    width: theme.spacing(1.5),
    marginLeft: theme.spacing(1)
  }
}))

export default useRewardsSidenavStyles
