import { createUseStyles } from 'react-jss'

const useAirdropPanelStyles = createUseStyles(theme => ({
  root: {

  },
  panelTitle: {
    fontWeight: theme.fontWeights.bold,
    fontSize: theme.spacing(3),
    lineHeight: `${theme.spacing(4.75)}px`
  },
  panelTimeLeft: {
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
  panelHighlightedText: {
    color: theme.palette.grey.main,
    fontWeight: theme.fontWeights.medium,
    lineHeight: `${theme.spacing(2.75)}px`,
    marginBottom: theme.spacing(1)
  },
  eligibilityCriteriaText: {
    fontWeight: theme.fontWeights.bold,
    lineHeight: `${theme.spacing(3)}px`
  },
  eligibileText: {
    fontWeight: theme.fontWeights.bold
  },
  rewardText: {
    color: theme.palette.grey.main,
    fontWeight: theme.fontWeights.medium,
    marginBottom: theme.spacing(3)
  },
  rewardCard: {
    background: theme.palette.grey.light,
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3),
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(4)
  },
  reward: {
    fontWeight: theme.fontWeights.bold,
    fontSize: theme.spacing(2.5),
    lineHeight: `${theme.spacing(2.5)}px`,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2)
  },
  rewardPercentage: {
    color: theme.palette.green
  },
  moreInfo: {
    background: theme.palette.grey.light,
    borderRadius: '100px',
    color: theme.palette.grey.main,
    fontWeight: theme.fontWeights.medium,
    padding: `${theme.spacing(1)}px ${theme.spacing(2.5)}px`,
    width: 'fit-content',
    margin: '0 auto',
    display: 'block'
  },
  tokenImage: {
    width: '100%'
  }
}))

export default useAirdropPanelStyles
