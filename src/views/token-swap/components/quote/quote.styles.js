import { createUseStyles } from 'react-jss'

const useQuoteStyles = createUseStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    background: theme.palette.grey.light,
    borderRadius: theme.spacing(2),
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px`,
    '&:hover': {
      cursor: 'pointer'
    }
  },
  bottomRow: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  nameCell: {
    display: 'flex',
    alignItems: 'center'
  },
  logo: {
    width: theme.spacing(3.5),
    marginLeft: theme.spacing(2)
  },
  name: {
    marginLeft: theme.spacing(1),
    fontSize: theme.spacing(2.5),
    fontWeight: theme.fontWeights.bold
  },
  toTokenAmountCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  toTokenAmount: {
    fontWeight: theme.fontWeights.medium,
    marginBottom: theme.spacing(1),
    color: theme.palette.black
  },
  toTokenAmountDiff: {
    fontSize: theme.spacing(1.75),
    fontWeight: theme.fontWeights.medium
  },
  rewardCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  reward: {
    fontWeight: theme.fontWeights.medium,
    marginBottom: theme.spacing(1),
    color: theme.palette.black
  },
  rewardHelperText: {
    fontWeight: theme.fontWeights.medium,
    color: theme.palette.grey.main
  }
}))

export default useQuoteStyles
