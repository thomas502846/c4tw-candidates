import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt="Care For Taiwan 創照服務設計"
      width={266}
      height={51}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={clsx('h-9 w-auto object-contain object-left lg:h-[51px]', className)}
      src="/logos/cft-logo-horizontal.svg"
    />
  )
}
