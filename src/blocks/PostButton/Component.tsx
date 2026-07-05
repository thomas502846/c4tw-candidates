import React from 'react'

export type PostButtonBlockProps = {
  label: string
  url?: string | null
}

/** 文章內頁按鈕：#dcd020 底、白字、0.3s（共用 .btn-cft .btn-highlight 配色原語） */
export const PostButtonBlock: React.FC<PostButtonBlockProps> = ({ label, url }) => {
  const cls =
    'btn-cft btn-highlight inline-flex items-center justify-center rounded-[30px] px-7 py-2.5 text-[16px] font-medium tracking-[0.06em] md:text-[17px]'
  return (
    <div className="my-8 flex justify-center">
      {url ? (
        <a className={cls} href={url}>
          {label}
        </a>
      ) : (
        <span className={cls}>{label}</span>
      )}
    </div>
  )
}
