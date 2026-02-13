import { U, GAP, RADIUS } from '../constants'
import { getTypeClass, getKeyLabel } from '../utils'
import { KeyIcon } from './KeyIcon'
import type { KeyDef, KeyData, Override, KeyLabel } from '../types'

interface KeyProps {
  keyDef: KeyDef
  data: KeyData | undefined
  showKeyNumber: boolean
  override?: Override
  onHover?: (pos: number, data: KeyData | undefined) => void
  onLeave?: () => void
  onClick?: (pos: number, label: KeyLabel, holdLabel: KeyLabel | null, hasHold: boolean) => void
}

export function Key({ keyDef, data, showKeyNumber, override, onHover, onLeave, onClick }: KeyProps) {
  const { x, y, w, h, pos } = keyDef

  const px = x * (U + GAP)
  const py = y * (U + GAP)
  const width = w * U + (w - 1) * GAP
  const height = h * U + (h - 1) * GAP

  const typeClass = data?.press ? getTypeClass(data.press.actionType) : 'none'
  const originalLabel = data?.press ? getKeyLabel(data.press.actionCode, data.press.actionType, data.press.layerMap) : ''
  const hasHold = data?.hold != null

  // Apply press override if exists
  let label: KeyLabel = originalLabel
  if (override?.press) {
    if (override.press.type === 'text') {
      label = override.press.value
    } else if (override.press.type === 'icon') {
      label = { icon: override.press.value }
    }
  }

  // Get hold label and apply hold override if exists
  let holdLabel: KeyLabel | null = hasHold && data?.hold
    ? getKeyLabel(data.hold.actionCode, data.hold.actionType, data.hold.layerMap)
    : null
  if (hasHold && override?.hold) {
    if (override.hold.type === 'text') {
      holdLabel = override.hold.value
    } else if (override.hold.type === 'icon') {
      holdLabel = { icon: override.hold.value }
    }
  }

  const holdIsIcon = typeof holdLabel === 'object' && holdLabel !== null && 'icon' in holdLabel
  const holdHasModifiers = typeof holdLabel === 'object' && holdLabel !== null && 'modifiers' in holdLabel
  const holdLabelText: string = holdIsIcon
    ? ''
    : (holdHasModifiers
      ? (holdLabel as { modifiers: string; label: string }).label
      : (typeof holdLabel === 'string' ? holdLabel : ''))
  const holdModifiers = holdHasModifiers ? (holdLabel as { modifiers: string; label: string }).modifiers : null

  const isIcon = typeof label === 'object' && label !== null && 'icon' in label
  const hasModifiers = typeof label === 'object' && label !== null && 'modifiers' in label
  const iconWithLabel = isIcon && 'label' in (label as { icon: string; label?: string })
  const labelText: string = isIcon
    ? (iconWithLabel ? (label as { icon: string; label: string }).label : '')
    : (hasModifiers ? (label as { modifiers: string; label: string }).label : (typeof label === 'string' ? label : ''))
  const modifiers = hasModifiers ? (label as { modifiers: string; label: string }).modifiers : null
  const labelClass = labelText.length > 4 ? 'small' : ''

  const holdBannerHeight = height * 0.4
  const labelY = hasHold ? py + (height - holdBannerHeight) / 2 : py + height / 2

  const handleClick = () => {
    if (!onClick) return
    const originalHoldLabel = hasHold && data?.hold
      ? getKeyLabel(data.hold.actionCode, data.hold.actionType, data.hold.layerMap)
      : null
    onClick(pos, originalLabel, originalHoldLabel, hasHold)
  }

  return (
    <g
      className={`key-group ${typeClass}${override ? ' has-override' : ''}`}
      onMouseEnter={() => onHover?.(pos, data)}
      onMouseLeave={() => onLeave?.()}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <rect
        className="key-shape"
        x={px}
        y={py}
        width={width}
        height={height}
        rx={RADIUS}
      />
      {/* Modifier badge in top-left corner */}
      {modifiers && (
        <>
          <path
            className="modifier-badge"
            d={`M ${px} ${py + RADIUS}
                A ${RADIUS} ${RADIUS} 0 0 1 ${px + RADIUS} ${py}
                L ${px + modifiers.length * 8 + 4} ${py}
                L ${px + modifiers.length * 8 + 4} ${py + 11 - 2}
                A 2 2 0 0 1 ${px + modifiers.length * 8 + 4 - 2} ${py + 11}
                L ${px} ${py + 11}
                Z`}
          />
          <text
            className="modifier-badge-text"
            x={px + (modifiers.length * 8 + 4) / 2}
            y={py + 7}
          >
            {modifiers}
          </text>
        </>
      )}
      {isIcon ? (
        <>
          <KeyIcon
            name={(label as { icon: string }).icon}
            x={px + width / 2}
            y={iconWithLabel ? labelY - 5 : labelY}
            size={16}
          />
          {iconWithLabel && (
            <text
              className="key-label small"
              x={px + width / 2}
              y={labelY + 10}
            >
              {(label as { icon: string; label: string }).label}
            </text>
          )}
        </>
      ) : (
        <text
          className={`key-label ${labelClass}`}
          x={px + width / 2}
          y={labelY}
        >
          {labelText}
        </text>
      )}
      {/* Hold banner at bottom */}
      {hasHold && (
        <>
          <path
            className="hold-banner"
            d={`M ${px} ${py + height - holdBannerHeight}
                L ${px + width} ${py + height - holdBannerHeight}
                L ${px + width} ${py + height - RADIUS}
                A ${RADIUS} ${RADIUS} 0 0 1 ${px + width - RADIUS} ${py + height}
                L ${px + RADIUS} ${py + height}
                A ${RADIUS} ${RADIUS} 0 0 1 ${px} ${py + height - RADIUS}
                Z`}
          />
          {holdIsIcon ? (
            <KeyIcon
              name={(holdLabel as { icon: string }).icon}
              x={px + width / 2}
              y={py + height - holdBannerHeight / 2}
              size={14}
              color="#2a2a4a"
            />
          ) : (
            <>
              {holdModifiers && (
                <text
                  className="hold-modifier-text"
                  x={px + 4}
                  y={py + height - holdBannerHeight / 2}
                >
                  {holdModifiers}
                </text>
              )}
              <text
                className="hold-label-text"
                x={px + width / 2}
                y={py + height - holdBannerHeight / 2}
              >
                {holdLabelText}
              </text>
            </>
          )}
        </>
      )}
      {showKeyNumber && (
        <text
          className="key-sublabel"
          x={px + width / 2}
          y={py + height - 4}
        >
          {pos}
        </text>
      )}
    </g>
  )
}
