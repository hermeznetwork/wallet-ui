import { createUseStyles } from 'react-jss'

const usePortalStyles = createUseStyles(() => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
}))

export default usePortalStyles
