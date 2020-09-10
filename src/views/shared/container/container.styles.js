const { createUseStyles } = require('react-jss')

const useContainerStyles = createUseStyles(theme => ({
  root: {
    width: '100%',
    background: ({ backgroundColor }) => backgroundColor || theme.white
  },
  wrapper: {
    width: '100%',
    display: 'flex',
    maxWidth: 700,
    margin: 'auto',
    padding: ({ disableGutters, disableTopGutter }) => disableGutters
      ? 0
      : disableTopGutter
        ? `0 ${theme.spacing(4)}px ${theme.spacing(5)}px`
        : `${theme.spacing(5)}px ${theme.spacing(4)}px`
  }
}))

export default useContainerStyles
