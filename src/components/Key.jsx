import { U, GAP, RADIUS } from '../constants'
import { getTypeClass, getKeyLabel } from '../utils'

export function Key({ keyDef, data, onHover, onLeave }) {
  const { x, y, w, h, pos } = keyDef

  const px = x * (U + GAP)
  const py = y * (U + GAP)
  const width = w * U + (w - 1) * GAP
  const height = h * U + (h - 1) * GAP

  const typeClass = data?.press ? getTypeClass(data.press.actionType) : 'none'
  const label = data?.press ? getKeyLabel(data.press.actionCode, data.press.actionType, data.press.layerMap) : '-'
  const hasHold = data?.hold != null

  const labelClass = label.length > 4 ? 'small' : ''
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
      <text
        className={`key-label ${labelClass}`}
        x={px + width / 2}
        y={labelY}
      >
        {label}
      </text>
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
      <text
        className="key-sublabel"
        x={px + width / 2}
        y={py + height - 4}
      >
        {pos}
      </text>
    </g>
  )
}
