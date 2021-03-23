import { createUseStyles } from 'react-jss'

const useChainIdErrorStyles = createUseStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(12)
  },
  image: {
    marginBottom: theme.spacing(3.5)
  },
  errorTitle: {
    fontSize: theme.spacing(2.5),
    fontWeight: theme.fontWeights.bold,
    marginBottom: theme.spacing(1),
    lineHeight: 1.6
  },
  errorDescription: {
    fontWeight: theme.fontWeights.medium,
    lineHeight: 1.75,
    textAlign: 'center',
    width: 400
  }
}))

export default useChainIdErrorStyles
