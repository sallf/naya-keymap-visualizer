import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'naya-keymap-db'

// Convert ArrayBuffer to base64 for storage
function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

// Convert base64 back to ArrayBuffer
function base64ToArrayBuffer(base64) {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

export function useDatabase(isBeta = false) {
  const [db, setDb] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [needsFile, setNeedsFile] = useState(false)

  const dbFileName = isBeta ? 'user-data-beta.db' : 'user-data.db'

  const loadDatabase = useCallback(async (arrayBuffer, saveToStorage = true) => {
    try {
      const SQL = await window.initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
      })
      const database = new SQL.Database(new Uint8Array(arrayBuffer))
      setDb(database)
      setLoading(false)
      setNeedsFile(false)
      setError(null)

      // Save to localStorage
      if (saveToStorage) {
        try {
          const base64 = arrayBufferToBase64(arrayBuffer)
          localStorage.setItem(STORAGE_KEY, base64)
        } catch (e) {
          console.warn('Could not save to localStorage:', e.message)
        }
      }
    } catch (e) {
      setError('Failed to load database: ' + e.message)
      setLoading(false)
    }
  }, [])

  const loadFromFile = useCallback(async (file) => {
    setLoading(true)
    setError(null)
    try {
      const arrayBuffer = await file.arrayBuffer()

      // Validate SQLite header
      const header = new Uint8Array(arrayBuffer.slice(0, 16))
      const headerStr = String.fromCharCode(...header)
      if (!headerStr.startsWith('SQLite format 3')) {
        throw new Error('Not a valid SQLite database file')
      }

      await loadDatabase(arrayBuffer)
    } catch (e) {
      setError('Failed to read file: ' + e.message)
      setLoading(false)
    }
  }, [loadDatabase])

  useEffect(() => {
    async function init() {
      // First, try to load from localStorage
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const buffer = base64ToArrayBuffer(stored)
          const header = new Uint8Array(buffer.slice(0, 16))
          const headerStr = String.fromCharCode(...header)
          if (headerStr.startsWith('SQLite format 3')) {
            await loadDatabase(buffer, false) // Don't re-save to storage
            return
          }
        }
      } catch (e) {
        console.warn('Could not load from localStorage:', e.message)
      }

      // Then try to load from public folder
      try {
        const response = await fetch(`/${dbFileName}`)

        // Check if we got a valid response with the right content type
        const contentType = response.headers.get('content-type')
        if (response.ok && contentType && !contentType.includes('text/html')) {
          const buffer = await response.arrayBuffer()
          // Quick validation: SQLite files start with "SQLite format 3"
          const header = new Uint8Array(buffer.slice(0, 16))
          const headerStr = String.fromCharCode(...header)
          if (headerStr.startsWith('SQLite format 3')) {
            await loadDatabase(buffer)
            return
          }
        }
      } catch (e) {
        // Ignore fetch errors
      }

      // No valid file found, prompt user to select one
      setLoading(false)
      setNeedsFile(true)
    }

    init()
  }, [loadDatabase, dbFileName])

  return { db, loading, error, needsFile, loadFromFile }
}

export function useProfiles(db) {
  const [profiles, setProfiles] = useState([])

  useEffect(() => {
    if (!db) return

    const results = db.exec('SELECT id, name FROM profiles ORDER BY name')
    if (results.length > 0) {
      setProfiles(results[0].values.map(([id, name]) => ({ id, name })))
    }
  }, [db])

  return profiles
}

export function useLayers(db, profileId) {
  const [layers, setLayers] = useState([])

  useEffect(() => {
    if (!db || !profileId) return

    const results = db.exec(`
      SELECT id, name, order_id
      FROM layers
      WHERE profile_id = '${profileId}'
      ORDER BY order_id
    `)
    if (results.length > 0) {
      setLayers(results[0].values.map(([id, name, order]) => ({ id, name, order })))
    }
  }, [db, profileId])

  return layers
}

export function useKeyData(db, layerId) {
  const [keyData, setKeyData] = useState(new Map())

  useEffect(() => {
    if (!db || !layerId) return

    const results = db.exec(`
      SELECT k.position_id, kb.action_code, kb.action_type, kb.behavior, k.color_hex
      FROM keys k
      LEFT JOIN key_bindings kb ON k.id = kb.key_id
      WHERE k.layer_id = '${layerId}'
      ORDER BY k.position_id, kb.behavior
    `)

    const data = new Map()
    if (results.length > 0) {
      for (const [posId, actionCode, actionType, behavior, colorHex] of results[0].values) {
        if (!data.has(posId)) {
          data.set(posId, { press: null, hold: null })
        }
        const binding = { actionCode, actionType, colorHex }
        if (behavior === 'hold') {
          data.get(posId).hold = binding
        } else {
          data.get(posId).press = binding
        }
      }
    }
    setKeyData(data)
  }, [db, layerId])

  return keyData
}
