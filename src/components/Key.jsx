import { U, GAP, RADIUS } from '../constants'
import { getTypeClass, getKeyLabel } from '../utils'
import { KeyIcon } from './KeyIcon'

export function Key({ keyDef, data, showKeyNumber, onHover, onLeave }) {
  const { x, y, w, h, pos } = keyDef

  const px = x * (U + GAP)
  const py = y * (U + GAP)
  const width = w * U + (w - 1) * GAP
  const height = h * U + (h - 1) * GAP

  const typeClass = data?.press ? getTypeClass(data.press.actionType) : 'none'
  const label = data?.press ? getKeyLabel(data.press.actionCode, data.press.actionType, data.press.layerMap) : ''
  const hasHold = data?.hold != null

  const isIcon = typeof label === 'object' && label?.icon
  const hasModifiers = typeof label === 'object' && label?.modifiers
  const labelText = isIcon ? '' : (hasModifiers ? label.label : label)
  const modifiers = hasModifiers ? label.modifiers : null
  const labelClass = typeof labelText === 'string' && labelText.length > 4 ? 'small' : ''
  const labelY = hasHold ? py + height * 0.4 : py + height / 2

  return (
    <g
      className={`key-group ${typeClass}`}
      onMouseEnter={() => onHover?.(pos, data)}
      onMouseLeave={() => onLeave?.()}
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
        <KeyIcon
          name={label.icon}
          x={px + width / 2}
          y={labelY}
          size={16}
        />
      ) : (
        <text
          className={`key-label ${labelClass}`}
          x={px + width / 2}
          y={labelY}
        >
          {labelText}
        </text>
      )}
      {hasHold && (
        <>
          <rect
            className="hold-badge"
            x={px + width / 2 - 10}
            y={py + height * 0.75 - 5}
            width={20}
            height={10}
            rx={2}
          />
          <text
            className="hold-indicator"
            x={px + width / 2}
            y={py + height * 0.75 + 1}
          >
            •••
          </text>
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
