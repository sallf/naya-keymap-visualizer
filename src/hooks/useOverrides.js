import { useState, useEffect, useCallback, useMemo } from 'react'

const STORAGE_KEY = 'naya-keymap-overrides'

export function useOverrides(layerId) {
  // Store all overrides keyed by layerId
  const [allOverrides, setAllOverrides] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  })

  // Save to localStorage whenever overrides change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allOverrides))
    } catch (e) {
      console.warn('Could not save overrides to localStorage:', e.message)
    }
  }, [allOverrides])

  // Get overrides for current layer
  const overrides = useMemo(() => {
    return layerId ? (allOverrides[layerId] || {}) : {}
  }, [allOverrides, layerId])

  const setOverride = useCallback((keyPos, override) => {
    if (!layerId) return
    setAllOverrides(prev => ({
      ...prev,
      [layerId]: {
        ...(prev[layerId] || {}),
        [keyPos]: override
      }
    }))
  }, [layerId])

  const clearOverride = useCallback((keyPos) => {
    if (!layerId) return
    setAllOverrides(prev => {
      const layerOverrides = { ...(prev[layerId] || {}) }
      delete layerOverrides[keyPos]
      return {
        ...prev,
        [layerId]: layerOverrides
      }
    })
  }, [layerId])

  const clearAllOverrides = useCallback(() => {
    if (!layerId) return
    setAllOverrides(prev => {
      const next = { ...prev }
      delete next[layerId]
      return next
    })
  }, [layerId])

  const getOverride = useCallback((keyPos) => {
    return overrides[keyPos] || null
  }, [overrides])

  return {
    overrides,
    allOverrides,
    setOverride,
    clearOverride,
    clearAllOverrides,
    getOverride
  }
}
