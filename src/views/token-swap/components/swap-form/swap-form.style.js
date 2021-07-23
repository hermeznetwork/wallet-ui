import { createUseStyles } from 'react-jss'

const useSwapFormStyles = createUseStyles(theme => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  circleBox: {
    height: theme.spacing(1),
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  circle: {
    position: 'absolute',
    height: theme.spacing(5.25),
    marginTop: theme.spacing(-3),
    zIndex: '99',
    border: `solid ${theme.spacing(1)}px white`,
    borderRadius: theme.spacing(20),
    boxSizing: 'content-box'
  }
}))

export default useSwapFormStyles
