import type { ModuleConfig, Override } from '../types'
import { getGestureLabel, getModuleActionLabel } from '../utils'
import { getExternalIconUrl, parseExternalIcon } from './KeyIcon'
import { getCustomImage } from '../hooks/useCustomImages'

const ROW_HEIGHT = 22
const HEADER_HEIGHT = 28
const CARD_PADDING = 12
const CARD_RADIUS = 8

export function getModuleCardHeight(config: ModuleConfig): number {
  const rows = config.bindings.length || 1 // at least 1 for empty state
  return HEADER_HEIGHT + CARD_PADDING + rows * ROW_HEIGHT + CARD_PADDING
}

interface ModuleProps {
  config: ModuleConfig
  x: number
  y: number
  width: number
  overrides?: Record<string, Override>
  side?: 'left' | 'right'
  onActionClick?: (overrideKey: string, currentLabel: string) => void
}

export function Module({ config, x, y, width, overrides, side, onActionClick }: ModuleProps) {
  const isDisabled = config.state === 'disabled'
  const height = getModuleCardHeight(config)
  const contentX = x + CARD_PADDING
  const contentWidth = width - CARD_PADDING * 2

  return (
    <g className={`module-card${isDisabled ? ' disabled' : ''}`} opacity={isDisabled ? 0.5 : 1}>
      {/* Card background */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={CARD_RADIUS}
        className="module-bg"
        strokeDasharray={isDisabled ? '6 3' : undefined}
      />

      {/* Header: type + name */}
      <text
        x={contentX}
        y={y + HEADER_HEIGHT / 2 + 1}
        className="module-header-text"
      >
        {config.type}
      </text>
      <text
        x={x + width - CARD_PADDING}
        y={y + HEADER_HEIGHT / 2 + 1}
        className="module-name-text"
        textAnchor="end"
      >
        {config.name}
      </text>

      {/* Separator */}
      <line
        x1={contentX}
        y1={y + HEADER_HEIGHT}
        x2={x + width - CARD_PADDING}
        y2={y + HEADER_HEIGHT}
        className="module-separator"
      />

      {/* Gesture rows */}
      {config.bindings.length === 0 ? (
        <text
          x={x + width / 2}
          y={y + HEADER_HEIGHT + CARD_PADDING + ROW_HEIGHT / 2}
          className="module-empty-text"
          textAnchor="middle"
        >
          No gestures configured
        </text>
      ) : (
        config.bindings.map((binding, i) => {
          const rowY = y + HEADER_HEIGHT + CARD_PADDING + i * ROW_HEIGHT + ROW_HEIGHT / 2
          const overrideKey = side ? `module:${side}:${i}` : undefined
          const override = overrideKey && overrides ? overrides[overrideKey] : undefined
          const pressOverride = override?.press
          const isClickable = !!onActionClick && !!overrideKey
          const hasOverride = !!override

          // Determine displayed action label
          let actionContent: React.ReactNode
          if (pressOverride?.type === 'custom-image') {
            const dataUrl = getCustomImage(pressOverride.value)
            if (dataUrl) {
              const imgSize = 20
              actionContent = (
                <image
                  href={dataUrl}
                  x={contentX + contentWidth - imgSize}
                  y={rowY - imgSize / 2}
                  width={imgSize}
                  height={imgSize}
                  className="module-override-icon"
                />
              )
            } else {
              actionContent = (
                <text x={contentX + contentWidth} y={rowY} className="module-action-text" textAnchor="end">
                  (image)
                </text>
              )
            }
          } else if (pressOverride?.type === 'external-icon') {
            const parsed = parseExternalIcon(pressOverride.value)
            if (parsed) {
              actionContent = (
                <image
                  href={getExternalIconUrl(parsed.library, parsed.name)}
                  x={contentX + contentWidth - 14}
                  y={rowY - 7}
                  width={14}
                  height={14}
                  className="module-override-icon"
                />
              )
            } else {
              actionContent = (
                <text x={contentX + contentWidth} y={rowY} className="module-action-text" textAnchor="end">
                  {pressOverride.value}
                </text>
              )
            }
          } else if (pressOverride?.type === 'text') {
            actionContent = (
              <text x={contentX + contentWidth} y={rowY} className="module-action-text" textAnchor="end">
                {pressOverride.value}
              </text>
            )
          } else {
            actionContent = (
              <text x={contentX + contentWidth} y={rowY} className="module-action-text" textAnchor="end">
                {getModuleActionLabel(binding)}
              </text>
            )
          }

          return (
            <g
              key={`${binding.behavior}-${i}`}
              className={`module-row${isClickable ? ' module-row-clickable' : ''}${hasOverride ? ' has-override' : ''}`}
              onClick={isClickable ? () => onActionClick!(overrideKey!, getModuleActionLabel(binding)) : undefined}
              style={isClickable ? { cursor: 'pointer' } : undefined}
            >
              {/* Invisible hit area for click */}
              {isClickable && (
                <rect
                  x={contentX}
                  y={rowY - ROW_HEIGHT / 2}
                  width={contentWidth}
                  height={ROW_HEIGHT}
                  fill="transparent"
                  className="module-row-hitarea"
                />
              )}
              <text
                x={contentX}
                y={rowY}
                className="module-gesture-text"
              >
                {getGestureLabel(binding.behavior)}
              </text>
              {actionContent}
            </g>
          )
        })
      )}
    </g>
  )
}
