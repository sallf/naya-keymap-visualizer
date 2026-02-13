import * as icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Override } from '../types'

// Icon name to component mapping (subset for display)
const iconComponents: Record<string, LucideIcon> = {
  'copy': icons.Copy,
  'clipboard-paste': icons.ClipboardPaste,
  'scissors': icons.Scissors,
  'save': icons.Save,
  'search': icons.Search,
  'undo-2': icons.Undo2,
  'redo-2': icons.Redo2,
  'x': icons.X,
  'power': icons.Power,
  'refresh-cw': icons.RefreshCw,
  'plus': icons.Plus,
  'minus': icons.Minus,
  'volume-2': icons.Volume2,
  'volume-1': icons.Volume1,
  'volume-x': icons.VolumeX,
  'play': icons.Play,
  'pause': icons.Pause,
  'skip-forward': icons.SkipForward,
  'skip-back': icons.SkipBack,
  'sun': icons.Sun,
  'moon': icons.Moon,
  'lightbulb': icons.Lightbulb,
  'bluetooth': icons.Bluetooth,
  'wifi': icons.Wifi,
  'cable': icons.Cable,
  'layout-grid': icons.LayoutGrid,
  'eye-off': icons.EyeOff,
  'home': icons.Home,
  'settings': icons.Settings,
  'terminal': icons.Terminal,
  'folder': icons.Folder,
  'file': icons.File,
  'trash-2': icons.Trash2,
  'lock': icons.Lock,
  'unlock': icons.Unlock,
  'globe': icons.Globe,
  'mail': icons.Mail,
  'message-square': icons.MessageSquare,
  'camera': icons.Camera,
  'image': icons.Image,
  'music': icons.Music,
  'video': icons.Video,
  'mic': icons.Mic,
  'headphones': icons.Headphones,
  'arrow-up': icons.ArrowUp,
  'arrow-down': icons.ArrowDown,
  'arrow-left': icons.ArrowLeft,
  'arrow-right': icons.ArrowRight,
  'chevron-up': icons.ChevronUp,
  'chevron-down': icons.ChevronDown,
  'chevron-left': icons.ChevronLeft,
  'chevron-right': icons.ChevronRight,
}

interface OverridesListProps {
  overrides: Record<string, Override>
  onClear: (keyPos: number) => void
  onClearAll: () => void
}

export function OverridesList({ overrides, onClear, onClearAll }: OverridesListProps) {
  const entries = Object.entries(overrides)

  if (entries.length === 0) {
    return null
  }

  return (
    <div className="overrides-list">
      <div className="overrides-header">
        <h3>Manual Overrides</h3>
        <button className="btn-clear-all" onClick={onClearAll}>
          Clear All
        </button>
      </div>
      <div className="overrides-items">
        {entries.map(([keyPos, override]) => {
          const pressOverride = override.press
          const holdOverride = override.hold
          const PressIcon = pressOverride?.type === 'icon' ? iconComponents[pressOverride.value] : null
          const HoldIcon = holdOverride?.type === 'icon' ? iconComponents[holdOverride.value] : null
          return (
            <div key={keyPos} className="override-item">
              <span className="override-key">Key {keyPos}</span>
              <span className="override-value">
                {pressOverride && (
                  <span className="override-part">
                    <span className="override-label">Press:</span>
                    {PressIcon ? <PressIcon size={14} /> : pressOverride.value}
                  </span>
                )}
                {holdOverride && (
                  <span className="override-part">
                    <span className="override-label">Hold:</span>
                    {HoldIcon ? <HoldIcon size={14} /> : holdOverride.value}
                  </span>
                )}
              </span>
              <button
                className="override-remove"
                onClick={() => onClear(Number(keyPos))}
                title="Remove override"
              >
                <icons.X size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
