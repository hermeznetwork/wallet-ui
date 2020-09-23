import { createUseStyles } from 'react-jss'

const useTransactionLayoutStyles = createUseStyles(theme => ({
  wrapper: {
    width: '100%',
    marginBottom: `${theme.spacing(3)}px`
  },
  header: {
    position: 'relative',
    height: 24,
    marginTop: `${theme.spacing(4)}px`,
    marginBottom: `${theme.spacing(9.5)}px`
  },
  headerPage: {
    position: 'fixed',
    width: '100%',
    background: theme.palette.primary.main,
    margin: 0,
    paddingTop: `${theme.spacing(4)}px`,
    height: `${theme.spacing(6.5)}px`
  },
  headerContent: {
    position: 'relative',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  heading: {
    fontSize: 24,
    lineHeight: '24px',
    fontWeight: theme.fontWeights.extraBold,
    color: theme.palette.black.light,
    margin: 0
  },
  backButton: {
    position: 'absolute',
    left: 0,
    border: 0,
    background: 0,
    outline: 'none',
    cursor: 'pointer',
    padding: 0
  },
  backButtonIcon: {
    width: '100%',
    height: '100%'
  },
  closeButtonLink: {
    position: 'absolute',
    right: 0,
    width: 30,
    height: '100%',
    lineHeight: '30px',
    textAlign: 'center',
    textDecoration: 'none'
  },
  closeButton: {
    width: '100%',
    height: '100%'
  },
  accountListWrapper: {
    width: '100%'
  }
}))

export default useTransactionLayoutStyles
