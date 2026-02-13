import { useState, useEffect } from 'react'
import { useDatabase, useProfiles, useLayers, useKeyData } from './hooks/useDatabase'
import { useOverrides } from './hooks/useOverrides'
import { Keyboard } from './components/Keyboard'
import { FileDropZone } from './components/FileDropZone'
import { Toggle } from './components/Toggle'
import { ManualOverrideModal } from './components/ManualOverrideModal'
import { OverridesList } from './components/OverridesList'

function App() {
  const [isBeta, setIsBeta] = useState(() => {
    const stored = localStorage.getItem('naya-keymap-beta')
    return stored === 'true'
  })

  const handleBetaToggle = (value) => {
    setIsBeta(value)
    localStorage.setItem('naya-keymap-beta', value.toString())
  }
  const { db, loading, error, needsFile, loadFromFile } = useDatabase(isBeta)
  const profiles = useProfiles(db)
  const [selectedProfile, setSelectedProfile] = useState(null)
  const [selectedLayer, setSelectedLayer] = useState(null)
  const [showKeyNumbers, setShowKeyNumbers] = useState(false)
  const [modalKey, setModalKey] = useState(null)
  const [modalLabel, setModalLabel] = useState('')
  const [modalHoldLabel, setModalHoldLabel] = useState('')
  const [modalHasHold, setModalHasHold] = useState(false)

  const layers = useLayers(db, selectedProfile)
  const { overrides, setOverride, clearOverride, clearAllOverrides } = useOverrides(selectedLayer)
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

  const handleKeyClick = (keyPos, label, holdLabel, hasHold) => {
    const labelStr = typeof label === 'object' && label !== null
      ? (label.icon || label.label || '')
      : (label || '')
    const holdLabelStr = typeof holdLabel === 'object' && holdLabel !== null
      ? (holdLabel.icon || holdLabel.label || '')
      : (holdLabel || '')
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
      </div>
    )
  }

  return (
    <div className="container">
      <header>
        <h1>Naya Keymap Viewer</h1>
        <div className="controls">
          <label htmlFor="profile-select">Profile:</label>
          <select
            id="profile-select"
            value={selectedProfile || ''}
            onChange={(e) => setSelectedProfile(e.target.value)}
          >
            {profiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.name}
              </option>
            ))}
          </select>

          <label htmlFor="layer-select">Layer:</label>
          <select
            id="layer-select"
            value={selectedLayer || ''}
            onChange={(e) => setSelectedLayer(e.target.value)}
          >
            {layers.map((layer) => (
              <option key={layer.id} value={layer.id}>
                {layer.order}: {layer.name}
              </option>
            ))}
          </select>

          <Toggle
            checked={showKeyNumbers}
            onChange={setShowKeyNumbers}
            label="Key #s"
          />
        </div>
      </header>

      <main>
        <Keyboard
          keyData={keyData}
          showKeyNumbers={showKeyNumbers}
          overrides={overrides}
          onKeyClick={handleKeyClick}
        />
      </main>

      <div className="legend">
        <div className="legend-item"><div className="legend-color key"></div> Key</div>
        <div className="legend-item"><div className="legend-color modifier"></div> Modifier</div>
        <div className="legend-item"><div className="legend-color layer"></div> Layer</div>
        <div className="legend-item"><div className="legend-color special"></div> Special</div>
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
    </div>
  )
}

export default App
