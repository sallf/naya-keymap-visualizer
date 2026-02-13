import { useState, useEffect, MouseEvent } from 'react'
import * as icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Override, OverrideValue } from '../types'
import { getExternalIconUrl } from './KeyIcon'

type ExternalLibrary = 'lucide' | 'heroicons' | 'tabler' | 'feather'

const EXTERNAL_LIBRARIES: { value: ExternalLibrary; label: string; browseUrl: string; placeholder: string }[] = [
  { value: 'lucide', label: 'Lucide (1500+ icons)', browseUrl: 'https://lucide.dev/icons/', placeholder: 'e.g. home, copy, arrow-right' },
  { value: 'heroicons', label: 'Heroicons (450+ icons)', browseUrl: 'https://heroicons.com/', placeholder: 'e.g. home, clipboard, arrow-right' },
  { value: 'tabler', label: 'Tabler (5900+ icons)', browseUrl: 'https://tabler.io/icons/', placeholder: 'e.g. home, copy, arrow-right' },
  { value: 'feather', label: 'Feather (286 icons)', browseUrl: 'https://feathericons.com/', placeholder: 'e.g. home, copy, arrow-right' },
]

// Available icons for selection
const AVAILABLE_ICONS: { name: string; label: string }[] = [
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

type Mode = 'text' | 'icon' | 'external'

interface OverrideSectionProps {
  title: string
  currentLabel: string
  mode: Mode
  setMode: (mode: Mode) => void
  textValue: string
  setTextValue: (value: string) => void
  selectedIcon: string | null
  setSelectedIcon: (icon: string | null) => void
  externalLibrary: ExternalLibrary
  setExternalLibrary: (library: ExternalLibrary) => void
  externalIconName: string
  setExternalIconName: (name: string) => void
}

// Map our library names to Iconify prefixes
const ICONIFY_PREFIXES: Record<ExternalLibrary, string> = {
  lucide: 'lucide',
  heroicons: 'heroicons-outline',
  tabler: 'tabler',
  feather: 'feather',
}

interface SearchResult {
  name: string
  prefix: string
}

function OverrideSection({
  title,
  currentLabel,
  mode,
  setMode,
  textValue,
  setTextValue,
  selectedIcon,
  setSelectedIcon,
  externalLibrary,
  setExternalLibrary,
  externalIconName,
  setExternalIconName
}: OverrideSectionProps) {
  const [previewStatus, setPreviewStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const previewUrl = externalIconName.trim()
    ? getExternalIconUrl(externalLibrary, externalIconName.trim())
    : null

  const selectedLibraryInfo = EXTERNAL_LIBRARIES.find(lib => lib.value === externalLibrary)

  // Debounced search using Iconify API
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([])
      return
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true)
      try {
        const prefix = ICONIFY_PREFIXES[externalLibrary]
        const response = await fetch(
          `https://api.iconify.design/search?query=${encodeURIComponent(searchQuery)}&prefix=${prefix}&limit=20`
        )
        const data = await response.json()
        if (data.icons && Array.isArray(data.icons)) {
          setSearchResults(data.icons.map((icon: string) => {
            const [iconPrefix, name] = icon.split(':')
            return { prefix: iconPrefix, name }
          }))
        } else {
          setSearchResults([])
        }
      } catch {
        setSearchResults([])
      }
      setIsSearching(false)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, externalLibrary])

  const handleSearchInput = (value: string) => {
    setSearchQuery(value.toLowerCase())
    setExternalIconName(value.toLowerCase())
    setPreviewStatus('idle')
  }

  const handleSelectSearchResult = (name: string) => {
    setExternalIconName(name)
    setSearchQuery(name)
    setSearchResults([])
    setPreviewStatus('idle')
  }

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
        <button
          className={`mode-tab ${mode === 'external' ? 'active' : ''}`}
          onClick={() => setMode('external')}
        >
          External
        </button>
      </div>

      {mode === 'text' && (
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
      )}

      {mode === 'icon' && (
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

      {mode === 'external' && (
        <div className="external-icon-section">
          <div className="external-library-select">
            <label>Library:</label>
            <select
              value={externalLibrary}
              onChange={e => {
                setExternalLibrary(e.target.value as ExternalLibrary)
                setPreviewStatus('idle')
              }}
            >
              {EXTERNAL_LIBRARIES.map(lib => (
                <option key={lib.value} value={lib.value}>{lib.label}</option>
              ))}
            </select>
          </div>

          <div className="external-icon-input">
            <label>Search icons:</label>
            <input
              type="text"
              value={searchQuery}
              onChange={e => handleSearchInput(e.target.value)}
              placeholder={selectedLibraryInfo?.placeholder || 'e.g. home, copy, arrow-right'}
            />
          </div>

          <div className="external-preview-area">
            {/* Show search results or preview */}
            {isSearching ? (
              <div className="external-preview idle">
                <span className="preview-placeholder">Searching...</span>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="external-preview search-results">
                <div className="search-results-grid">
                  {searchResults.map(result => (
                    <button
                      key={result.name}
                      className={`search-result-item ${externalIconName === result.name ? 'selected' : ''}`}
                      onClick={() => handleSelectSearchResult(result.name)}
                      title={result.name}
                    >
                      <img
                        src={getExternalIconUrl(externalLibrary, result.name)}
                        alt={result.name}
                        width={20}
                        height={20}
                      />
                      <span className="result-name">{result.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : previewUrl ? (
              <div className={`external-preview ${previewStatus}`}>
                <img
                  src={previewUrl}
                  alt={externalIconName}
                  onLoad={() => setPreviewStatus('success')}
                  onError={() => setPreviewStatus('error')}
                />
                {previewStatus === 'error' && (
                  <span className="preview-error">Icon not found</span>
                )}
              </div>
            ) : (
              <div className="external-preview idle">
                <span className="preview-placeholder">Type to search icons</span>
              </div>
            )}
          </div>

          {selectedLibraryInfo && (
            <a
              href={selectedLibraryInfo.browseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="external-browse-link"
            >
              <icons.ExternalLink size={14} />
              Browse icons at {selectedLibraryInfo.browseUrl.replace('https://', '').replace('/', '')}
            </a>
          )}
        </div>
      )}
    </div>
  )
}

interface ManualOverrideModalProps {
  keyPos: number | null
  currentLabel: string
  currentHoldLabel: string
  hasHold: boolean
  onSave: (keyPos: number, override: Override) => void
  onClose: () => void
  onClear: (keyPos: number) => void
}

export function ManualOverrideModal({
  keyPos,
  currentLabel,
  currentHoldLabel,
  hasHold,
  onSave,
  onClose,
  onClear
}: ManualOverrideModalProps) {
  // Press override state
  const [pressMode, setPressMode] = useState<Mode>('text')
  const [pressTextValue, setPressTextValue] = useState('')
  const [pressSelectedIcon, setPressSelectedIcon] = useState<string | null>(null)
  const [pressExternalLibrary, setPressExternalLibrary] = useState<ExternalLibrary>('lucide')
  const [pressExternalIconName, setPressExternalIconName] = useState('')

  // Hold override state
  const [holdMode, setHoldMode] = useState<Mode>('text')
  const [holdTextValue, setHoldTextValue] = useState('')
  const [holdSelectedIcon, setHoldSelectedIcon] = useState<string | null>(null)
  const [holdExternalLibrary, setHoldExternalLibrary] = useState<ExternalLibrary>('lucide')
  const [holdExternalIconName, setHoldExternalIconName] = useState('')

  useEffect(() => {
    // Reset form when modal opens
    setPressTextValue('')
    setPressSelectedIcon(null)
    setPressMode('text')
    setPressExternalLibrary('lucide')
    setPressExternalIconName('')
    setHoldTextValue('')
    setHoldSelectedIcon(null)
    setHoldMode('text')
    setHoldExternalLibrary('lucide')
    setHoldExternalIconName('')
  }, [keyPos])

  const handleSave = () => {
    if (keyPos === null) return

    let pressOverride: OverrideValue | null = null
    let holdOverride: OverrideValue | null = null

    if (pressMode === 'text' && pressTextValue.trim()) {
      pressOverride = { type: 'text', value: pressTextValue.trim() }
    } else if (pressMode === 'icon' && pressSelectedIcon) {
      pressOverride = { type: 'icon', value: pressSelectedIcon }
    } else if (pressMode === 'external' && pressExternalIconName.trim()) {
      pressOverride = { type: 'external-icon', value: `${pressExternalLibrary}:${pressExternalIconName.trim()}` }
    }

    if (hasHold) {
      if (holdMode === 'text' && holdTextValue.trim()) {
        holdOverride = { type: 'text', value: holdTextValue.trim() }
      } else if (holdMode === 'icon' && holdSelectedIcon) {
        holdOverride = { type: 'icon', value: holdSelectedIcon }
      } else if (holdMode === 'external' && holdExternalIconName.trim()) {
        holdOverride = { type: 'external-icon', value: `${holdExternalLibrary}:${holdExternalIconName.trim()}` }
      }
    }

    // Only save if at least one override is set
    if (pressOverride || holdOverride) {
      onSave(keyPos, { press: pressOverride, hold: holdOverride })
    }
    onClose()
  }

  const handleClear = () => {
    if (keyPos === null) return
    onClear(keyPos)
    onClose()
  }

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (keyPos === null) return null

  const hasPressOverride = (pressMode === 'text' && pressTextValue.trim()) || (pressMode === 'icon' && pressSelectedIcon) || (pressMode === 'external' && pressExternalIconName.trim())
  const hasHoldOverride = hasHold && ((holdMode === 'text' && holdTextValue.trim()) || (holdMode === 'icon' && holdSelectedIcon) || (holdMode === 'external' && holdExternalIconName.trim()))
  const canSave = hasPressOverride || hasHoldOverride

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
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
            externalLibrary={pressExternalLibrary}
            setExternalLibrary={setPressExternalLibrary}
            externalIconName={pressExternalIconName}
            setExternalIconName={setPressExternalIconName}
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
              externalLibrary={holdExternalLibrary}
              setExternalLibrary={setHoldExternalLibrary}
              externalIconName={holdExternalIconName}
              setExternalIconName={setHoldExternalIconName}
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
