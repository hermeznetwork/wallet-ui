import { createUseStyles } from 'react-jss'

const usePortalStyles = createUseStyles((theme) => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 'auto',
    right: 0,
    bottom: 0,
    width: 295
  }
}))

export default usePortalStyles
