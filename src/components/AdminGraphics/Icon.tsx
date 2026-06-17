import React from 'react'

/**
 * Replaces the small Payload icon in the admin nav header.
 * Uses the customer's square mark (favicon).
 */
const Icon: React.FC = () => {
  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt="Care For Taiwan"
      src="/favicon.svg"
      style={{ height: '28px', width: 'auto' }}
    />
  )
}

export default Icon
