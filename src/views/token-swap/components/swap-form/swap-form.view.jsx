import React from 'react'

function SwapForm ({ onGoToQuotes, onOpenOfferSidenav }) {
  return (
    <div>
      <p>SwapForm</p>
      <button onClick={onGoToQuotes}>Go to quotes</button>
      <button onClick={onOpenOfferSidenav}>Open offer sidenav</button>
    </div>
  )
}

export default SwapForm
