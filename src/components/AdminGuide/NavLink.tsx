import React from 'react'

import './navlink.scss'

/**
 * Renders in the admin nav (via `admin.components.afterNavLinks`) so the
 * customer can always reach the usage guide at /admin/guide.
 */
const GuideNavLink: React.FC = () => {
  return (
    <a className="cms-guide-navlink" href="/admin/guide">
      使用說明
    </a>
  )
}

export default GuideNavLink
