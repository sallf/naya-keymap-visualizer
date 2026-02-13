import { useState, useCallback, DragEvent, ChangeEvent } from 'react'
import { Toggle } from './Toggle'

interface FileDropZoneProps {
  onFileSelect: (file: File) => void
  isBeta: boolean
  onBetaToggle: (value: boolean) => void
}

export function FileDropZone({ onFileSelect, isBeta, onBetaToggle }: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  const folderName = isBeta ? 'NayaFlow-Beta' : 'NayaFlow'
  const dbFileName = isBeta ? 'user-data-beta.db' : 'user-data.db'
  const macPath = `~/Library/Application Support/${folderName}/${dbFileName}`
  const winPath = `%APPDATA%\\${folderName}\\${dbFileName}`

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file && file.name.endsWith('.db')) {
      onFileSelect(file)
    }
  }, [onFileSelect])

  const handleFileInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }, [onFileSelect])

  return (
    <div className="file-drop-zone-container">
      <div
        className={`file-drop-zone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="drop-icon">📁</div>
        <h2>Load Your Naya Configuration</h2>
        <p>Drag and drop your database file here, or click to browse</p>

        <input
          type="file"
          accept=".db"
          onChange={handleFileInput}
          id="file-input"
          className="file-input"
        />
        <label htmlFor="file-input" className="file-button">
          Choose File
        </label>

        <div className="file-location">
          <h3>Where to find it:</h3>
          <div className="os-instructions">
            <div className="os-section">
              <strong>macOS:</strong>
              <code>{macPath}</code>
              <button
                className="copy-button"
                onClick={() => navigator.clipboard.writeText(macPath)}
              >
                Copy
              </button>
            </div>
            <div className="os-section">
              <strong>Windows:</strong>
              <code>{winPath}</code>
              <button
                className="copy-button"
                onClick={() => navigator.clipboard.writeText(winPath)}
              >
                Copy
              </button>
            </div>
          </div>
          <p className="hint">
            Tip: On macOS, press <kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>G</kbd> in Finder and paste the path
          </p>

          <div className="beta-toggle">
            <Toggle
              checked={isBeta}
              onChange={onBetaToggle}
              label="Beta version?"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
