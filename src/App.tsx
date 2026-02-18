import { useState, useEffect, ChangeEvent, useCallback } from 'react'
import { X, Github } from 'lucide-react'
import {
  useDatabase,
  useProfiles,
  useLayers,
  useKeyData,
  clearStoredDatabase,
} from './hooks/useDatabase'
import { useOverrides } from './hooks/useOverrides'
import { Keyboard } from './components/Keyboard'
import { FileDropZone } from './components/FileDropZone'
import { Toggle } from './components/Toggle'
import { ManualOverrideModal } from './components/ManualOverrideModal'
import { OverridesList } from './components/OverridesList'
import type { KeyLabel } from './types'

function App() {
  const [isBeta, setIsBeta] = useState(() => {
    const stored = localStorage.getItem('naya-keymap-beta')
    return stored === 'true'
  })

  const handleBetaToggle = (value: boolean) => {
    setIsBeta(value)
    localStorage.setItem('naya-keymap-beta', value.toString())
  }
  const { db, loading, error, needsFile, loadFromFile } = useDatabase(isBeta)
  const profiles = useProfiles(db)
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null)
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null)
  const [showKeyNumbers, setShowKeyNumbers] = useState(false)
  const [modalKey, setModalKey] = useState<number | null>(null)
  const [modalLabel, setModalLabel] = useState('')
  const [modalHoldLabel, setModalHoldLabel] = useState('')
  const [modalHasHold, setModalHasHold] = useState(false)

  const layers = useLayers(db, selectedProfile)
  const { overrides, setOverride, clearOverride, clearAllOverrides } =
    useOverrides(selectedLayer)
  const keyData = useKeyData(db, selectedLayer, selectedProfile)

  // Set initial profile when profiles load
  useEffect(() => {
    if (profiles.length > 0 && !selectedProfile) {
      setSelectedProfile(profiles[0].id)
    }
  }, [profiles, selectedProfile])

  // Set initial layer when layers load
  useEffect(() => {
    if (layers.length > 0 && !selectedLayer) {
      setSelectedLayer(layers[0].id)
    }
  }, [layers, selectedLayer])

  // Reset layer when profile changes
  useEffect(() => {
    setSelectedLayer(null)
  }, [selectedProfile])

  const handleKeyClick = (
    keyPos: number,
    label: KeyLabel,
    holdLabel: KeyLabel | null,
    hasHold: boolean,
  ) => {
    const labelStr =
      typeof label === 'object' && label !== null
        ? 'icon' in label
          ? label.icon
          : 'label' in label
            ? label.label
            : ''
        : label || ''
    const holdLabelStr =
      typeof holdLabel === 'object' && holdLabel !== null
        ? 'icon' in holdLabel
          ? holdLabel.icon
          : 'label' in holdLabel
            ? holdLabel.label
            : ''
        : holdLabel || ''
    setModalKey(keyPos)
    setModalLabel(labelStr)
    setModalHoldLabel(holdLabelStr)
    setModalHasHold(hasHold)
  }

  const handleModalClose = () => {
    setModalKey(null)
    setModalLabel('')
    setModalHoldLabel('')
    setModalHasHold(false)
  }

  const handleProfileChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedProfile(e.target.value)
  }

  const handleLayerChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedLayer(e.target.value)
  }

  const handleClearKeymap = useCallback(() => {
    if (
      confirm(
        'Clear stored configuration? You will need to reload the database file.',
      )
    ) {
      clearStoredDatabase()
      window.location.reload()
    }
  }, [])

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <p>Loading database...</p>
        </div>
      </div>
    )
  }

  if (needsFile || error) {
    return (
      <div className="container">
        <header>
          <h1>Naya Keymap Viewer</h1>
        </header>
        {error && (
          <div className="error" style={{ marginBottom: '20px' }}>
            <strong>Error:</strong> {error}
          </div>
        )}
        <FileDropZone
          onFileSelect={loadFromFile}
          isBeta={isBeta}
          onBetaToggle={handleBetaToggle}
        />
        <footer className="app-footer">
          <a href="https://github.com/sallf/naya-keymap-visualizer" target="_blank" rel="noopener noreferrer">
            <Github size={16} />
            github.com/sallf/naya-keymap-visualizer
          </a>
        </footer>
      </div>
    )
  }

  return (
    <div className="container">
      <header>
        <h1>Naya Keymap Viewer</h1>
        <div className="controls">
          <div className="control-group">
            <label htmlFor="profile-select">Profile:</label>
            <select
              id="profile-select"
              value={selectedProfile || ''}
              onChange={handleProfileChange}
            >
              {profiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.name}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="layer-select">Layer:</label>
            <select
              id="layer-select"
              value={selectedLayer || ''}
              onChange={handleLayerChange}
            >
              {layers.map((layer) => (
                <option key={layer.id} value={layer.id}>
                  {layer.order}: {layer.name}
                </option>
              ))}
            </select>
          </div>

          <Toggle
            checked={showKeyNumbers}
            onChange={setShowKeyNumbers}
            label="Key #s"
          />
        </div>
      </header>

      <main>
        <div className="keyboard-container">
          <button
            className="btn-link keyboard-clear"
            onClick={handleClearKeymap}
          >
            <X size={14} />
            Clear Configuration File
          </button>
          <Keyboard
            keyData={keyData}
            showKeyNumbers={showKeyNumbers}
            overrides={overrides}
            onKeyClick={handleKeyClick}
          />
        </div>
      </main>

      <div className="legend">
        <div className="legend-key-diagram">
          <svg width="80" height="80" viewBox="0 0 80 80">
            {/* Key shape */}
            <rect x="0" y="0" width="80" height="80" rx="6" fill="#2a2a4a" stroke="#5a5a7a" strokeWidth="1.5" />
            {/* Hold banner */}
            <path d="M 0 48 L 80 48 L 80 74 A 6 6 0 0 1 74 80 L 6 80 A 6 6 0 0 1 0 74 Z" fill="#5a5a7a" />
            {/* Modifier badge */}
            <path d="M 0 6 A 6 6 0 0 1 6 0 L 32 0 L 32 14 A 2 2 0 0 1 30 16 L 0 16 Z" fill="#5a5a7a" />
            {/* Modifier label */}
            <text x="16" y="10" fill="#2a2a4a" fontSize="7" fontWeight="600" textAnchor="middle" dominantBaseline="middle">mod</text>
            {/* Click label */}
            <text x="40" y="30" fill="#fff" fontSize="11" fontWeight="500" textAnchor="middle" dominantBaseline="middle">Click</text>
            {/* Hold label */}
            <text x="40" y="64" fill="#2a2a4a" fontSize="9" fontWeight="600" textAnchor="middle" dominantBaseline="middle">Hold</text>
          </svg>
        </div>
        <div className="legend-colors">
          <div className="legend-item">
            <div className="legend-color key"></div> Key
          </div>
          <div className="legend-item">
            <div className="legend-color modifier"></div> Modifier
          </div>
          <div className="legend-item">
            <div className="legend-color layer"></div> Layer
          </div>
          <div className="legend-item">
            <div className="legend-color special"></div> Special
          </div>
        </div>
      </div>

      <OverridesList
        overrides={overrides}
        onClear={clearOverride}
        onClearAll={clearAllOverrides}
      />

      <ManualOverrideModal
        keyPos={modalKey}
        currentLabel={modalLabel}
        currentHoldLabel={modalHoldLabel}
        hasHold={modalHasHold}
        onSave={setOverride}
        onClose={handleModalClose}
        onClear={clearOverride}
      />

      <footer className="app-footer">
        <a href="https://github.com/sallf/naya-keymap-visualizer" target="_blank" rel="noopener noreferrer">
          <Github size={16} />
          github.com/sallf/naya-keymap-visualizer
        </a>
      </footer>
    </div>
  )
}

export default App
