import React from 'react'

function Quotes ({ onOpenOfferSidenav }) {
  return (
    <div>
      <p>Quotes</p>
      <button onClick={onOpenOfferSidenav}>Open offer sidenav</button>
    </div>
  )
}

export default Quotes
