import { useState, useEffect, useCallback, useMemo } from 'react'
import type { Override, AllOverrides } from '../types'

const STORAGE_KEY = 'naya-keymap-overrides'

export function useOverrides(layerId: string | null) {
  // Store all overrides keyed by layerId
  const [allOverrides, setAllOverrides] = useState<AllOverrides>(() => {
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
      console.warn('Could not save overrides to localStorage:', (e as Error).message)
    }
  }, [allOverrides])

  // Get overrides for current layer
  const overrides = useMemo(() => {
    return layerId ? (allOverrides[layerId] || {}) : {}
  }, [allOverrides, layerId])

  const setOverride = useCallback((keyPos: number, override: Override) => {
    if (!layerId) return
    setAllOverrides(prev => ({
      ...prev,
      [layerId]: {
        ...(prev[layerId] || {}),
        [keyPos]: override
      }
    }))
  }, [layerId])

  const clearOverride = useCallback((keyPos: number) => {
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

  const getOverride = useCallback((keyPos: number): Override | null => {
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
