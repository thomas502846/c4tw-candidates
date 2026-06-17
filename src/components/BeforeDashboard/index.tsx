import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

import './index.scss'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>歡迎使用內容管理後台</h4>
      </Banner>
      您可以從左側選單管理網站的各項內容：
      <ul className={`${baseClass}__instructions`}>
        <li>編輯頁面、最新消息、案例故事、媒體報導等內容區塊。</li>
        <li>上傳並管理圖片等媒體檔案。</li>
        <li>
          完成編輯後，可前往
          <a href="/" target="_blank" rel="noopener noreferrer">
            前台網站
          </a>
          檢視實際呈現效果。
        </li>
      </ul>
      內容支援繁體中文與英文兩種語系，編輯時可於上方切換語言分別填寫。
    </div>
  )
}

export default BeforeDashboard
