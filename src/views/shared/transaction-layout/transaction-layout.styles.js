import { createUseStyles } from 'react-jss'

const useTransactionLayoutStyles = createUseStyles(theme => ({
  wrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: `${theme.spacing(3)}px`
  },
  header: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
    marginTop: `${theme.spacing(4)}px`,
    marginBottom: `${theme.spacing(10)}px`
  },
  heading: {
    fontSize: 24,
    lineHeight: '24px',
    fontWeight: theme.fontWeights.extraBold,
    color: theme.palette.black
  },
  backButton: {
    position: 'absolute',
    left: 0,
    border: 0,
    background: 0,
    outline: 'none',
    cursor: 'pointer'
  },
  backButtonIcon: {
    width: '100%',
    height: '100%'
  },
  closeButtonLink: {
    position: 'absolute',
    right: 0,
    width: 30,
    height: 30,
    lineHeight: '30px',
    textAlign: 'center',
    textDecoration: 'none'
  },
  closeButton: {
    width: '100%',
    height: '100%'
  }
}))

export default useTransactionLayoutStyles
