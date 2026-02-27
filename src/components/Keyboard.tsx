import { useState, MouseEvent } from 'react'
import { LAYOUT, U, GAP } from '../constants'
import { Key } from './Key'
import { Tooltip } from './Tooltip'
import { Module, getModuleCardHeight } from './Module'
import type { KeyData, Override, KeyLabel, TooltipData, ModuleData } from '../types'

interface KeyboardProps {
  keyData: Map<number, KeyData>
  showKeyNumbers: boolean
  overrides: Record<string, Override>
  onKeyClick: (keyPos: number, label: KeyLabel, holdLabel: KeyLabel | null, hasHold: boolean) => void
  moduleData: ModuleData
  onModuleActionClick?: (overrideKey: string, currentLabel: string) => void
}

export function Keyboard({ keyData, showKeyNumbers, overrides, onKeyClick, moduleData, onModuleActionClick }: KeyboardProps) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)

  const leftWidth = 8 * (U + GAP)
  const rightWidth = 9 * (U + GAP)
  const keysHeight = 6.5 * (U + GAP)
  const centerGap = 40
  const totalWidth = leftWidth + centerGap + rightWidth + 40

  // Calculate module area
  const hasModules = moduleData.left !== null || moduleData.right !== null
  const moduleGap = hasModules ? 20 : 0
  const leftModuleHeight = moduleData.left ? getModuleCardHeight(moduleData.left) : 0
  const rightModuleHeight = moduleData.right ? getModuleCardHeight(moduleData.right) : 0
  const maxModuleHeight = Math.max(leftModuleHeight, rightModuleHeight)
  const height = keysHeight + (hasModules ? moduleGap + maxModuleHeight : 0)

  const handleHover = (pos: number, data: KeyData | undefined, event: MouseEvent) => {
    if (!data) return
    setTooltip({
      pos,
      data,
      x: event.clientX,
      y: event.clientY
    })
  }

  const handleMove = (event: MouseEvent) => {
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
              showKeyNumber={showKeyNumbers}
              override={overrides?.[keyDef.pos]}
              onHover={(pos, data) => handleHover(pos, data, event as unknown as MouseEvent)}
              onLeave={handleLeave}
              onClick={onKeyClick}
            />
          ))}
        </g>

        <g className="right-half" transform={`translate(${leftWidth + centerGap}, 20)`}>
          {LAYOUT.right.map((keyDef) => (
            <Key
              key={keyDef.pos}
              keyDef={keyDef}
              data={keyData.get(keyDef.pos)}
              showKeyNumber={showKeyNumbers}
              override={overrides?.[keyDef.pos]}
              onHover={(pos, data) => handleHover(pos, data, event as unknown as MouseEvent)}
              onLeave={handleLeave}
              onClick={onKeyClick}
            />
          ))}
        </g>

        {/* Module cards below each half */}
        {moduleData.left && (
          <Module
            config={moduleData.left}
            x={20}
            y={keysHeight + moduleGap}
            width={leftWidth - 20}
            overrides={overrides}
            side="left"
            onActionClick={onModuleActionClick}
          />
        )}
        {moduleData.right && (
          <Module
            config={moduleData.right}
            x={leftWidth + centerGap}
            y={keysHeight + moduleGap}
            width={rightWidth}
            overrides={overrides}
            side="right"
            onActionClick={onModuleActionClick}
          />
        )}
      </svg>

      {tooltip && <Tooltip {...tooltip} />}
    </div>
  )
}
