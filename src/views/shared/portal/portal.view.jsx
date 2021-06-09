import React from 'react'
import ReactDOM from 'react-dom'
import usePortalStyles from './portal.styles'

function Portal ({ selector, children }) {
  const classes = usePortalStyles()
  const portalRoot = document.querySelector('#portal-root')
  const [divElement] = React.useState(() => {
    const el = document.createElement('div')

    el.classList.add(classes.root)

    return el
  })

  React.useEffect(() => {
    portalRoot.appendChild(divElement)

    return () => portalRoot.removeChild(divElement)
  }, [portalRoot, divElement])

  return ReactDOM.createPortal(children, divElement)
}

export default Portal
