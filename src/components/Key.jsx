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

  // Get hold label
  const holdLabel = hasHold ? getKeyLabel(data.hold.actionCode, data.hold.actionType, data.hold.layerMap) : null
  const holdIsIcon = typeof holdLabel === 'object' && holdLabel?.icon
  const holdHasModifiers = typeof holdLabel === 'object' && holdLabel?.modifiers
  const holdLabelText = holdIsIcon ? '' : (holdHasModifiers ? holdLabel.label : holdLabel)
  const holdModifiers = holdHasModifiers ? holdLabel.modifiers : null

  const isIcon = typeof label === 'object' && label?.icon
  const hasModifiers = typeof label === 'object' && label?.modifiers
  const labelText = isIcon ? '' : (hasModifiers ? label.label : label)
  const modifiers = hasModifiers ? label.modifiers : null
  const labelClass = typeof labelText === 'string' && labelText.length > 4 ? 'small' : ''

  const holdBannerHeight = height * 0.4
  const labelY = hasHold ? py + (height - holdBannerHeight) / 2 : py + height / 2

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
              name={holdLabel.icon}
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
