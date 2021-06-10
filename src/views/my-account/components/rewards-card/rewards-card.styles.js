import { createUseStyles } from 'react-jss'

const useRewardsCardStyles = createUseStyles((theme) => ({
  root: {
    padding: `${theme.spacing(2)}px ${theme.spacing(2.5)}px ${theme.spacing(2.5)}px ${theme.spacing(4)}px `,
    borderRadius: theme.spacing(2),
    backgroundColor: theme.palette.black,
    color: theme.palette.white,
    width: '100%'
  },
  cardHeader: {
    borderBottom: `2px solid ${theme.palette.grey.dark05}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: theme.spacing(1.25),
    marginBottom: theme.spacing(1)
  },
  cardHeading: {
    margin: 0
  },
  moreInfoButton: {
    appearance: 'none',
    border: 0,
    cursor: 'pointer',
    fontSize: theme.spacing(1.75),
    fontWeight: theme.fontWeights.medium,
    width: 'fit-content',
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
    borderRadius: theme.spacing(2),
    backgroundColor: theme.palette.grey.dark05,
    color: theme.palette.grey.light,
    '&:hover': {
      background: theme.palette.grey.hover
    }
  },
  rewardText: {
    fontWeight: theme.fontWeights.bold,
    color: theme.palette.grey.light,
    lineHeight: `${theme.spacing(3)}px`
  },
  rewardPercentage: {
    color: theme.palette.green
  }
}))

export default useRewardsCardStyles
