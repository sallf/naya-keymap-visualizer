import { useState, useEffect, MouseEvent } from 'react'
import * as icons from 'lucide-react'
import type { Override, OverrideValue } from '../types'

interface SearchResult {
  name: string
  prefix: string
}

interface OverrideSectionProps {
  title: string
  currentLabel: string
  mode: 'text' | 'icon'
  setMode: (mode: 'text' | 'icon') => void
  textValue: string
  setTextValue: (value: string) => void
  selectedIcon: { prefix: string; name: string } | null
  setSelectedIcon: (icon: { prefix: string; name: string } | null) => void
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
}: OverrideSectionProps) {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Debounced search using Iconify API
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([])
      return
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true)
      try {
        const response = await fetch(
          `https://api.iconify.design/search?query=${encodeURIComponent(searchQuery)}&limit=30`
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
  }, [searchQuery])

  const handleSelectSearchResult = (result: SearchResult) => {
    setSelectedIcon(result)
    setSearchResults([])
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
        <div className="external-icon-section">
          <div className="external-icon-input">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value.toLowerCase())}
              placeholder="Search 200,000+ icons..."
            />
          </div>

          <div className="external-preview-area">
            {isSearching ? (
              <div className="external-preview idle">
                <span className="preview-placeholder">Searching...</span>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="external-preview search-results">
                <div className="search-results-grid">
                  {searchResults.map(result => (
                    <button
                      key={`${result.prefix}:${result.name}`}
                      className={`search-result-item ${selectedIcon?.prefix === result.prefix && selectedIcon?.name === result.name ? 'selected' : ''}`}
                      onClick={() => handleSelectSearchResult(result)}
                      title={`${result.prefix}:${result.name}`}
                    >
                      <img
                        src={`https://api.iconify.design/${result.prefix}/${result.name}.svg`}
                        alt={result.name}
                        width={20}
                        height={20}
                      />
                      <span className="result-name">{result.name}</span>
                      <span className="result-prefix">{result.prefix}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : selectedIcon ? (
              <div className="external-preview success">
                <img
                  src={`https://api.iconify.design/${selectedIcon.prefix}/${selectedIcon.name}.svg`}
                  alt={selectedIcon.name}
                  width={24}
                  height={24}
                />
                <span className="preview-selected-name">{selectedIcon.prefix}:{selectedIcon.name}</span>
              </div>
            ) : (
              <div className="external-preview idle">
                <span className="preview-placeholder">Type to search icons</span>
              </div>
            )}
          </div>

          <a
            href="https://icon-sets.iconify.design/"
            target="_blank"
            rel="noopener noreferrer"
            className="external-browse-link"
          >
            <icons.ExternalLink size={14} />
            Browse all icons at icon-sets.iconify.design
          </a>
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
  const [pressMode, setPressMode] = useState<'text' | 'icon'>('text')
  const [pressTextValue, setPressTextValue] = useState('')
  const [pressSelectedIcon, setPressSelectedIcon] = useState<{ prefix: string; name: string } | null>(null)

  // Hold override state
  const [holdMode, setHoldMode] = useState<'text' | 'icon'>('text')
  const [holdTextValue, setHoldTextValue] = useState('')
  const [holdSelectedIcon, setHoldSelectedIcon] = useState<{ prefix: string; name: string } | null>(null)

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
    if (keyPos === null) return

    let pressOverride: OverrideValue | null = null
    let holdOverride: OverrideValue | null = null

    if (pressMode === 'text' && pressTextValue.trim()) {
      pressOverride = { type: 'text', value: pressTextValue.trim() }
    } else if (pressMode === 'icon' && pressSelectedIcon) {
      pressOverride = { type: 'external-icon', value: `${pressSelectedIcon.prefix}:${pressSelectedIcon.name}` }
    }

    if (hasHold) {
      if (holdMode === 'text' && holdTextValue.trim()) {
        holdOverride = { type: 'text', value: holdTextValue.trim() }
      } else if (holdMode === 'icon' && holdSelectedIcon) {
        holdOverride = { type: 'external-icon', value: `${holdSelectedIcon.prefix}:${holdSelectedIcon.name}` }
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

  const hasPressOverride = (pressMode === 'text' && pressTextValue.trim()) || (pressMode === 'icon' && pressSelectedIcon)
  const hasHoldOverride = hasHold && ((holdMode === 'text' && holdTextValue.trim()) || (holdMode === 'icon' && holdSelectedIcon))
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
