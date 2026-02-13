import { useState, useEffect } from 'react'
import * as icons from 'lucide-react'

// Available icons for selection
const AVAILABLE_ICONS = [
  { name: 'copy', label: 'Copy' },
  { name: 'clipboard-paste', label: 'Paste' },
  { name: 'scissors', label: 'Cut' },
  { name: 'save', label: 'Save' },
  { name: 'search', label: 'Search' },
  { name: 'undo-2', label: 'Undo' },
  { name: 'redo-2', label: 'Redo' },
  { name: 'x', label: 'Close' },
  { name: 'power', label: 'Power' },
  { name: 'refresh-cw', label: 'Refresh' },
  { name: 'plus', label: 'Plus' },
  { name: 'minus', label: 'Minus' },
  { name: 'volume-2', label: 'Volume Up' },
  { name: 'volume-1', label: 'Volume Down' },
  { name: 'volume-x', label: 'Mute' },
  { name: 'play', label: 'Play' },
  { name: 'pause', label: 'Pause' },
  { name: 'skip-forward', label: 'Next' },
  { name: 'skip-back', label: 'Previous' },
  { name: 'sun', label: 'Brightness' },
  { name: 'moon', label: 'Sleep' },
  { name: 'lightbulb', label: 'Light' },
  { name: 'bluetooth', label: 'Bluetooth' },
  { name: 'wifi', label: 'Wifi' },
  { name: 'cable', label: 'USB' },
  { name: 'layout-grid', label: 'Grid' },
  { name: 'eye-off', label: 'Hidden' },
  { name: 'home', label: 'Home' },
  { name: 'settings', label: 'Settings' },
  { name: 'terminal', label: 'Terminal' },
  { name: 'folder', label: 'Folder' },
  { name: 'file', label: 'File' },
  { name: 'trash-2', label: 'Delete' },
  { name: 'lock', label: 'Lock' },
  { name: 'unlock', label: 'Unlock' },
  { name: 'globe', label: 'Globe' },
  { name: 'mail', label: 'Mail' },
  { name: 'message-square', label: 'Message' },
  { name: 'camera', label: 'Camera' },
  { name: 'image', label: 'Image' },
  { name: 'music', label: 'Music' },
  { name: 'video', label: 'Video' },
  { name: 'mic', label: 'Mic' },
  { name: 'headphones', label: 'Headphones' },
  { name: 'arrow-up', label: 'Arrow Up' },
  { name: 'arrow-down', label: 'Arrow Down' },
  { name: 'arrow-left', label: 'Arrow Left' },
  { name: 'arrow-right', label: 'Arrow Right' },
  { name: 'chevron-up', label: 'Chevron Up' },
  { name: 'chevron-down', label: 'Chevron Down' },
  { name: 'chevron-left', label: 'Chevron Left' },
  { name: 'chevron-right', label: 'Chevron Right' },
]

// Icon name to component mapping
const iconComponents = {
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

function OverrideSection({ title, currentLabel, mode, setMode, textValue, setTextValue, selectedIcon, setSelectedIcon }) {
  return (
    <div className="override-section">
      <div className="override-section-header">
        <span className="override-section-title">{title}</span>
        <span className="override-section-current">Current: <strong>{currentLabel || '(empty)'}</strong></span>
      </div>

      <div className="mode-tabs">
        <button
          className={`mode-tab ${mode === 'text' ? 'active' : ''}`}
          onClick={() => setMode('text')}
        >
          Text
        </button>
        <button
          className={`mode-tab ${mode === 'icon' ? 'active' : ''}`}
          onClick={() => setMode('icon')}
        >
          Icon
        </button>
      </div>

      {mode === 'text' ? (
        <div className="text-input-section">
          <input
            type="text"
            value={textValue}
            onChange={e => setTextValue(e.target.value)}
            placeholder="Enter custom label..."
            maxLength={10}
          />
          <p className="input-hint">Max 10 characters</p>
        </div>
      ) : (
        <div className="icon-grid">
          {AVAILABLE_ICONS.map(({ name, label }) => {
            const IconComponent = iconComponents[name]
            return (
              <button
                key={name}
                className={`icon-option ${selectedIcon === name ? 'selected' : ''}`}
                onClick={() => setSelectedIcon(name)}
                title={label}
              >
                <IconComponent size={20} />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function ManualOverrideModal({ keyPos, currentLabel, currentHoldLabel, hasHold, onSave, onClose, onClear }) {
  // Press override state
  const [pressMode, setPressMode] = useState('text')
  const [pressTextValue, setPressTextValue] = useState('')
  const [pressSelectedIcon, setPressSelectedIcon] = useState(null)

  // Hold override state
  const [holdMode, setHoldMode] = useState('text')
  const [holdTextValue, setHoldTextValue] = useState('')
  const [holdSelectedIcon, setHoldSelectedIcon] = useState(null)

  useEffect(() => {
    // Reset form when modal opens
    setPressTextValue('')
    setPressSelectedIcon(null)
    setPressMode('text')
    setHoldTextValue('')
    setHoldSelectedIcon(null)
    setHoldMode('text')
  }, [keyPos])

  const handleSave = () => {
    let pressOverride = null
    let holdOverride = null

    if (pressMode === 'text' && pressTextValue.trim()) {
      pressOverride = { type: 'text', value: pressTextValue.trim() }
    } else if (pressMode === 'icon' && pressSelectedIcon) {
      pressOverride = { type: 'icon', value: pressSelectedIcon }
    }

    if (hasHold) {
      if (holdMode === 'text' && holdTextValue.trim()) {
        holdOverride = { type: 'text', value: holdTextValue.trim() }
      } else if (holdMode === 'icon' && holdSelectedIcon) {
        holdOverride = { type: 'icon', value: holdSelectedIcon }
      }
    }

    // Only save if at least one override is set
    if (pressOverride || holdOverride) {
      onSave(keyPos, { press: pressOverride, hold: holdOverride })
    }
    onClose()
  }

  const handleClear = () => {
    onClear(keyPos)
    onClose()
  }

  if (keyPos === null) return null

  const hasPressOverride = (pressMode === 'text' && pressTextValue.trim()) || (pressMode === 'icon' && pressSelectedIcon)
  const hasHoldOverride = hasHold && ((holdMode === 'text' && holdTextValue.trim()) || (holdMode === 'icon' && holdSelectedIcon))
  const canSave = hasPressOverride || hasHoldOverride

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Override Key {keyPos}</h3>
          <button className="modal-close" onClick={onClose}>
            <icons.X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <OverrideSection
            title="Press"
            currentLabel={currentLabel}
            mode={pressMode}
            setMode={setPressMode}
            textValue={pressTextValue}
            setTextValue={setPressTextValue}
            selectedIcon={pressSelectedIcon}
            setSelectedIcon={setPressSelectedIcon}
          />

          {hasHold && (
            <OverrideSection
              title="Hold"
              currentLabel={currentHoldLabel}
              mode={holdMode}
              setMode={setHoldMode}
              textValue={holdTextValue}
              setTextValue={setHoldTextValue}
              selectedIcon={holdSelectedIcon}
              setSelectedIcon={setHoldSelectedIcon}
            />
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-clear" onClick={handleClear}>
            Clear Override
          </button>
          <div className="modal-actions">
            <button className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn-save"
              onClick={handleSave}
              disabled={!canSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
