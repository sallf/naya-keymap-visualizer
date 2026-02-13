import { useState } from 'react'
import { LAYOUT, U, GAP } from '../constants'
import { Key } from './Key'
import { Tooltip } from './Tooltip'

export function Keyboard({ keyData }) {
  const [tooltip, setTooltip] = useState(null)

  const leftWidth = 8 * (U + GAP)
  const rightWidth = 9 * (U + GAP)
  const height = 6.5 * (U + GAP)
  const centerGap = 40
  const totalWidth = leftWidth + centerGap + rightWidth + 40

  const handleHover = (pos, data, event) => {
    if (!data) return
    setTooltip({
      pos,
      data,
      x: event.clientX,
      y: event.clientY
    })
  }

  const handleMove = (event) => {
    if (tooltip) {
      setTooltip(prev => prev ? { ...prev, x: event.clientX, y: event.clientY } : null)
    }
  }

  const handleLeave = () => {
    setTooltip(null)
  }

  return (
    <div className="keyboard-wrapper" onMouseMove={handleMove}>
      <svg
        className="keyboard-svg"
        viewBox={`0 0 ${totalWidth} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g className="left-half" transform="translate(20, 20)">
          {LAYOUT.left.map((keyDef) => (
            <Key
              key={keyDef.pos}
              keyDef={keyDef}
              data={keyData.get(keyDef.pos)}
              onHover={(pos, data) => handleHover(pos, data, event)}
              onLeave={handleLeave}
            />
          ))}
        </g>

        <g className="right-half" transform={`translate(${leftWidth + centerGap}, 20)`}>
          {LAYOUT.right.map((keyDef) => (
            <Key
              key={keyDef.pos}
              keyDef={keyDef}
              data={keyData.get(keyDef.pos)}
              onHover={(pos, data) => handleHover(pos, data, event)}
              onLeave={handleLeave}
            />
          ))}
        </g>
      </svg>

      {tooltip && <Tooltip {...tooltip} />}
    </div>
  )
}
