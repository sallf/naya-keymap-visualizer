// Database types
export interface Profile {
  id: string
  name: string
}

export interface Layer {
  id: string
  name: string
  order: number
}

export interface LayerInfo {
  name: string
  order: number
}

export interface KeyBinding {
  actionCode: string
  actionType: string
  colorHex: string | null
  layerMap: Map<string, LayerInfo>
}

export interface KeyData {
  press: KeyBinding | null
  hold: KeyBinding | null
}

// Layout types
export interface KeyDef {
  x: number
  y: number
  w: number
  h: number
  pos: number
}

export interface Layout {
  left: KeyDef[]
  right: KeyDef[]
}

// Override types
export interface OverrideValue {
  type: 'text' | 'icon' | 'external-icon'
  value: string
  // For external-icon: value = "simpleicons:slack" or "lucide:accessibility"
}

export interface Override {
  press: OverrideValue | null
  hold: OverrideValue | null
}

export interface AllOverrides {
  [layerId: string]: {
    [keyPos: string]: Override
  }
}

// Label types
export type KeyLabel =
  | string
  | { icon: string; label?: string }
  | { modifiers: string; label: string }

// Tooltip types
export interface TooltipData {
  pos: number
  data: KeyData
  x: number
  y: number
}
