'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useConfig, useField, useFormFields } from '@payloadcms/ui'

import {
  DEFAULT_FRAME_POSITION,
  resolveFramePosition,
  ZOOM_MAX,
  ZOOM_MIN,
  type FramePosition,
  type FrameTier,
} from '@/utilities/framePositionCss'
import type { FrameAspects } from '@/fields/responsiveFramePosition'

type TierKey = keyof FramePosition

type Props = {
  path: string
  field?: { label?: string; admin?: { description?: string } }
  imageField?: string
  frames: FrameAspects
  variantField?: string
  framesByVariant?: Record<string, FrameAspects>
}

const TABS: { key: TierKey; label: string }[] = [
  { key: 'mobile', label: '手機' },
  { key: 'tablet', label: '平板' },
  { key: 'desktop', label: '電腦' },
]

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))

// 同區塊圖片欄位路徑：把本欄位路徑最後一段換成圖片欄位名（例：layout.0.framePos → layout.0.image）
const siblingPath = (path: string, field: string): string => {
  const parts = path.split('.')
  parts[parts.length - 1] = field
  return parts.join('.')
}

export const ResponsiveFramePositionField: React.FC<Props> = ({
  path,
  field,
  imageField = 'image',
  frames,
  variantField,
  framesByVariant,
}) => {
  const { value, setValue } = useField<FramePosition | null>({ path })
  const pos = useMemo(() => resolveFramePosition(value, DEFAULT_FRAME_POSITION), [value])

  const [tier, setTier] = useState<TierKey>('mobile')
  const boxRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)

  // 讀同區塊圖片欄位的值（媒體 id 或已 populate 的物件）
  const imagePath = useMemo(() => siblingPath(path, imageField), [path, imageField])
  const imageValue = useFormFields(([fields]) => fields[imagePath]?.value as unknown)

  // 框比例隨 variant 變化時，挑對應預覽框（讓拖曳框＝該版型實際裁切範圍）
  const variantPath = useMemo(
    () => (variantField ? siblingPath(path, variantField) : null),
    [path, variantField],
  )
  const variantValue = useFormFields(([fields]) =>
    variantPath ? (fields[variantPath]?.value as string | undefined) : undefined,
  )
  const activeFrames = (variantValue && framesByVariant?.[variantValue]) || frames

  const { config } = useConfig()
  const apiBase = `${config?.serverURL ?? ''}${config?.routes?.api ?? '/api'}`

  const [imageUrl, setImageUrl] = useState<string | null>(null)
  useEffect(() => {
    let cancelled = false
    const v = imageValue as { url?: string } | number | string | null | undefined
    if (v && typeof v === 'object' && v.url) {
      setImageUrl(v.url)
      return
    }
    if (v === null || v === undefined || v === '') {
      setImageUrl(null)
      return
    }
    // 只有 id → 取媒體文件拿 url
    fetch(`${apiBase}/media/${v}?depth=0`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((doc) => {
        if (!cancelled) setImageUrl(doc?.url ?? null)
      })
      .catch(() => {
        if (!cancelled) setImageUrl(null)
      })
    return () => {
      cancelled = true
    }
  }, [imageValue, apiBase])

  const current = pos[tier]

  const update = useCallback(
    (patch: Partial<FrameTier>) => {
      const next: FramePosition = {
        ...pos,
        [tier]: { ...pos[tier], ...patch },
      }
      setValue(next)
    },
    [pos, tier, setValue],
  )

  const updateFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const box = boxRef.current
      if (!box) return
      const rect = box.getBoundingClientRect()
      const x = clamp(((clientX - rect.left) / rect.width) * 100, 0, 100)
      const y = clamp(((clientY - rect.top) / rect.height) * 100, 0, 100)
      update({ x: Math.round(x), y: Math.round(y) })
    },
    [update],
  )

  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
    updateFromPointer(e.clientX, e.clientY)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (draggingRef.current) updateFromPointer(e.clientX, e.clientY)
  }
  const onPointerUp = () => {
    draggingRef.current = false
  }

  const label = field?.label ?? '照片裁切位置（手機／平板／電腦）'
  const description = field?.admin?.description

  return (
    <div className="field-type" style={{ marginBottom: 24 }}>
      <label className="field-label" style={{ display: 'block', marginBottom: 6 }}>
        {label}
      </label>
      {description && (
        <p style={{ color: 'var(--theme-elevation-500)', fontSize: 13, margin: '0 0 10px' }}>
          {description}
        </p>
      )}

      {/* 裝置分頁 */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        {TABS.map((t) => {
          const active = t.key === tier
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTier(t.key)}
              style={{
                padding: '6px 16px',
                borderRadius: 6,
                border: '1px solid var(--theme-elevation-150)',
                background: active ? 'var(--theme-elevation-800)' : 'var(--theme-elevation-50)',
                color: active ? 'var(--theme-elevation-0)' : 'var(--theme-elevation-800)',
                cursor: 'pointer',
                fontWeight: active ? 600 : 400,
              }}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      {/* 預覽框（該裝置實際比例）＋拖曳焦點 */}
      <div
        ref={boxRef}
        onPointerDown={imageUrl ? onPointerDown : undefined}
        onPointerMove={imageUrl ? onPointerMove : undefined}
        onPointerUp={onPointerUp}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 520,
          aspectRatio: activeFrames[tier],
          overflow: 'hidden',
          borderRadius: 8,
          border: '1px solid var(--theme-elevation-150)',
          background: 'var(--theme-elevation-100)',
          cursor: imageUrl ? 'crosshair' : 'default',
          touchAction: 'none',
          userSelect: 'none',
        }}
      >
        {imageUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt=""
              draggable={false}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: current.zoom < 1 ? 'contain' : 'cover',
                objectPosition: `${current.x}% ${current.y}%`,
                transform: `scale(${current.zoom})`,
                transformOrigin: `${current.x}% ${current.y}%`,
                pointerEvents: 'none',
              }}
            />
            {/* 焦點指示 */}
            <div
              style={{
                position: 'absolute',
                left: `${current.x}%`,
                top: `${current.y}%`,
                width: 22,
                height: 22,
                marginLeft: -11,
                marginTop: -11,
                borderRadius: '50%',
                border: '2px solid #fff',
                boxShadow: '0 0 0 2px rgba(0,0,0,0.45)',
                pointerEvents: 'none',
              }}
            />
          </>
        ) : (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--theme-elevation-500)',
              fontSize: 14,
              textAlign: 'center',
              padding: 16,
            }}
          >
            請先在上方選擇圖片，這裡會顯示拖曳預覽
          </div>
        )}
      </div>

      {/* 縮放 + 讀數 + 重設 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 12, maxWidth: 520 }}>
        <label style={{ fontSize: 13, whiteSpace: 'nowrap' }}>縮放</label>
        <input
          type="range"
          min={ZOOM_MIN}
          max={ZOOM_MAX}
          step={0.05}
          value={current.zoom}
          disabled={!imageUrl}
          onChange={(e) => update({ zoom: Number(e.target.value) })}
          style={{ flex: 1 }}
        />
        <span style={{ fontSize: 13, width: 64, textAlign: 'right' }}>
          {current.zoom < 1 ? `完整 ${current.zoom.toFixed(2)}×` : `${current.zoom.toFixed(2)}×`}
        </span>
        <button
          type="button"
          onClick={() => update({ x: 50, y: 50, zoom: 1 })}
          style={{
            padding: '4px 10px',
            borderRadius: 6,
            border: '1px solid var(--theme-elevation-150)',
            background: 'var(--theme-elevation-50)',
            cursor: 'pointer',
            fontSize: 13,
          }}
        >
          重設此裝置
        </button>
      </div>
      <p style={{ color: 'var(--theme-elevation-400)', fontSize: 12, marginTop: 6 }}>
        焦點 X {current.x}％・Y {current.y}％
      </p>
    </div>
  )
}

export default ResponsiveFramePositionField
