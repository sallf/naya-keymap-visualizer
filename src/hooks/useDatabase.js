import { useState, useEffect } from 'react'

export function useDatabase() {
  const [db, setDb] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function init() {
      try {
        // sql.js is loaded via script tag in index.html
        const SQL = await window.initSqlJs({
          locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
        })

        const response = await fetch('/user-data-beta.db')
        if (!response.ok) {
          throw new Error('Could not load database file')
        }

        const buffer = await response.arrayBuffer()
        const database = new SQL.Database(new Uint8Array(buffer))
        setDb(database)
        setLoading(false)
      } catch (e) {
        setError(e.message)
        setLoading(false)
      }
    }

    init()
  }, [])

  return { db, loading, error }
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
