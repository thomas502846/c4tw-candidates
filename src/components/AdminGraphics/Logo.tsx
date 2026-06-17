import React from 'react'

/**
 * Replaces the Payload logo shown on the admin login screen.
 * Uses the customer's horizontal brand logo from /public/logos.
 */
const Logo: React.FC = () => {
  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt="Care For Taiwan 創照服務設計"
      src="/logos/cft-logo-horizontal.svg"
      style={{ height: 'auto', width: '320px', maxWidth: '100%' }}
    />
  )
}

export default Logo
