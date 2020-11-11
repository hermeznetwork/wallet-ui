import { createUseStyles } from 'react-jss'

const useContainerStyles = createUseStyles(theme => ({
  root: {
    flex: ({ fullHeight }) => fullHeight ? 1 : 'auto',
    width: '100%',
    background: ({ backgroundColor }) => backgroundColor || theme.white,
    paddingTop: ({ addHeaderPadding }) => addHeaderPadding ? theme.headerHeight : 0
  },
  wrapper: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    maxWidth: 700,
    margin: 'auto',
    padding: ({ disableVerticalGutters, disableTopGutter }) => disableVerticalGutters
      ? `0 ${theme.spacing(3.5)}px`
      : disableTopGutter
        ? `0 ${theme.spacing(3.5)}px ${theme.spacing(5)}px`
        : `${theme.spacing(5)}px ${theme.spacing(3.5)}px`
  }
}))

export default useContainerStyles
