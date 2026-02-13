import { useState, useEffect, useCallback } from 'react'
import type { Profile, Layer, KeyData, LayerInfo } from '../types'

const STORAGE_KEY = 'naya-keymap-db'

// Convert ArrayBuffer to base64 for storage
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

// Convert base64 back to ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

export function useDatabase(isBeta = false) {
  const [db, setDb] = useState<Database | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [needsFile, setNeedsFile] = useState(false)

  const dbFileName = isBeta ? 'user-data-beta.db' : 'user-data.db'

  const loadDatabase = useCallback(async (arrayBuffer: ArrayBuffer, saveToStorage = true) => {
    try {
      const SQL = await window.initSqlJs({
        locateFile: (file: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
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
          console.warn('Could not save to localStorage:', (e as Error).message)
        }
      }
    } catch (e) {
      setError('Failed to load database: ' + (e as Error).message)
      setLoading(false)
    }
  }, [])

  const loadFromFile = useCallback(async (file: File) => {
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
      setError('Failed to read file: ' + (e as Error).message)
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
        console.warn('Could not load from localStorage:', (e as Error).message)
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
      } catch {
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

export function useProfiles(db: Database | null): Profile[] {
  const [profiles, setProfiles] = useState<Profile[]>([])

  useEffect(() => {
    if (!db) return

    const results = db.exec('SELECT id, name FROM profiles ORDER BY name')
    if (results.length > 0) {
      setProfiles(results[0].values.map(([id, name]) => ({
        id: id as string,
        name: name as string
      })))
    }
  }, [db])

  return profiles
}

export function useLayers(db: Database | null, profileId: string | null): Layer[] {
  const [layers, setLayers] = useState<Layer[]>([])

  useEffect(() => {
    if (!db || !profileId) return

    const results = db.exec(`
      SELECT id, name, order_id
      FROM layers
      WHERE profile_id = '${profileId}'
      ORDER BY order_id
    `)
    if (results.length > 0) {
      setLayers(results[0].values.map(([id, name, order]) => ({
        id: id as string,
        name: name as string,
        order: order as number
      })))
    }
  }, [db, profileId])

  return layers
}

export function useKeyData(
  db: Database | null,
  layerId: string | null,
  profileId: string | null
): Map<number, KeyData> {
  const [keyData, setKeyData] = useState<Map<number, KeyData>>(new Map())

  useEffect(() => {
    if (!db || !layerId) return

    // First, build a map of layer IDs to their order and name
    const layerMap = new Map<string, LayerInfo>()
    if (profileId) {
      const layerResults = db.exec(`
        SELECT id, name, order_id FROM layers WHERE profile_id = '${profileId}' ORDER BY order_id
      `)
      if (layerResults.length > 0) {
        for (const [id, name, order] of layerResults[0].values) {
          layerMap.set(id as string, { name: name as string, order: order as number })
        }
      }
    }

    const results = db.exec(`
      SELECT k.position_id, kb.action_code, kb.action_type, kb.behavior, k.color_hex
      FROM keys k
      LEFT JOIN key_bindings kb ON k.id = kb.key_id
      WHERE k.layer_id = '${layerId}'
      ORDER BY k.position_id, kb.behavior
    `)

    const data = new Map<number, KeyData>()
    if (results.length > 0) {
      for (const [posId, actionCode, actionType, behavior, colorHex] of results[0].values) {
        const posIdNum = posId as number
        if (!data.has(posIdNum)) {
          data.set(posIdNum, { press: null, hold: null })
        }
        const binding = {
          actionCode: actionCode as string,
          actionType: actionType as string,
          colorHex: colorHex as string | null,
          layerMap
        }
        if (behavior === 'hold') {
          data.get(posIdNum)!.hold = binding
        } else {
          data.get(posIdNum)!.press = binding
        }
      }
    }
    setKeyData(data)
  }, [db, layerId, profileId])

  return keyData
}
