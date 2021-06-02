import { createUseStyles } from 'react-jss'

const useMyAccountStyles = createUseStyles(theme => ({
  root: {
    width: '100%'
  },
  hermezEthereumAddress: {
    fontSize: theme.spacing(2.5),
    fontWeight: theme.fontWeights.medium,
    textAlign: 'center',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2.5)
  },
  topSection: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  buttonsWrapper: {
    display: 'flex'
  },
  qrButton: {
    marginRight: theme.spacing(2)
  },
  qrIcon: {
    width: 20,
    height: 20,
    '& path': {
      fill: theme.palette.grey.dark
    }
  },
  bottomSection: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: -theme.spacing(2)
  },
  settingContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: `${theme.spacing(3)}px ${theme.spacing(1)}px`,
    marginLeft: `-${theme.spacing(1)}px`,
    background: 'transparent',
    border: 'none',
    '&:not(:first-child)': {
      cursor: 'pointer'
    },
    '&:focus': {
      outline: 'none'
    }
  },
  settingHeader: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  settingTitle: {
    fontWeight: theme.fontWeights.bold,
    marginLeft: theme.spacing(2)
  },
  settingSubTitle: {
    color: theme.palette.grey.main,
    fontWeight: theme.fontWeights.medium,
    marginTop: theme.spacing(1),
    paddingLeft: theme.spacing(4.5)
  },
  break: {

  },
  settingContent: {
    marginTop: theme.spacing(1.75),
    marginLeft: theme.spacing(4.5)
  },
  airdropCard: {
    marginTop: theme.spacing(5),
    padding: `${theme.spacing(2)}px ${theme.spacing(2.5)}px ${theme.spacing(2.5)}px ${theme.spacing(4)}px `,
    borderRadius: theme.spacing(2),
    backgroundColor: theme.palette.black,
    color: theme.palette.white,
    width: '100%'
  },
  cardHeader: {
    borderBottom: '1px solid rgba(122, 124, 137, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: theme.spacing(1)
  },
  cardHeading: {
    margin: 0
  },
  moreInfo: {
    fontSize: theme.spacing(1.75),
    width: 'fit-content',
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
    borderRadius: theme.spacing(2),
    backgroundColor: 'rgba(122, 124, 137, 0.5)',
    color: theme.palette.white
  },
  rewardText: {
    fontWeight: theme.fontWeights.bold,
    marginTop: theme.spacing(1.5)
  },
  rewardPercentage: {
    color: theme.palette.green
  }
}))

export default useMyAccountStyles
