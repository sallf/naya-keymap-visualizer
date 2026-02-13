import { KEY_LABELS } from './constants'

// Map action types to their display names
const LAYER_TYPE_LABELS = {
  'layer_polite_hold': 'Hold',
  'layer_polite_toggle': 'Toggle',
  'layer_rude_toggle': 'To',
  'layer_polite_oneshot': 'Sticky',
}

export function getTypeClass(actionType) {
  switch (actionType) {
    case 'modifier': return 'modifier'
    case 'layer_polite_hold':
    case 'layer_polite_toggle':
    case 'layer_rude_toggle':
    case 'layer_polite_oneshot':
      return 'layer'
    case 'none': return 'none'
    case 'trans': return 'trans'
    case 'LED':
    case 'naya':
    case 'bluetooth':
    case 'out':
    case 'mouse':
      return 'special'
    default: return ''
  }
}

export function getKeyLabel(actionCode, actionType, layerMap) {
  if (!actionCode) return '-'

  // Handle disabled keys
  if (actionType === 'none' && actionCode === 'DISABLE') {
    return '⊘'
  }

  // Handle transparent keys
  if (actionType === 'trans') {
    return '👁‍🗨'
  }

  // Handle layer actions
  if (actionType in LAYER_TYPE_LABELS) {
    // Extract layer ID from various prefixes
    const layerId = actionCode
      .replace('MO_LAYER_', '')
      .replace('TOGGLE_LAYER_', '')
      .replace('TO_LAYER_', '')
      .replace('OSL_LAYER_', '')
    const layerInfo = layerMap?.get(layerId)
    const layerNum = layerInfo ? layerInfo.order : '?'
    const typeLabel = LAYER_TYPE_LABELS[actionType]
    return `L${layerNum} ${typeLabel}`
  }

  if (actionType === 'shortcut_alias') {
    return actionCode.replace(/LGUI \+ |LSHIFT \+ |LCTRL \+ |LALT \+ /g, '').substring(0, 6)
  }

  if (actionType === 'combo') {
    const match = actionCode.match(/LSHIFT \+ (\w+)/)
    if (match) {
      const base = match[1]
      const shiftMap = {
        'COMMA': '<', 'PERIOD': '>', 'SLASH': '?',
        'SEMICOLON': ':', 'GRAVE': '~',
        '1': '!', '2': '@', '3': '#', '4': '$', '5': '%',
        '6': '^', '7': '&', '8': '*', '9': '(', '0': ')'
      }
      return shiftMap[base] || actionCode.substring(0, 6)
    }
    return actionCode.substring(0, 6)
  }

  if (KEY_LABELS[actionCode]) {
    return KEY_LABELS[actionCode]
  }

  if (actionCode.length === 1) {
    return actionCode
  }

  return actionCode.replace(/_/g, ' ').substring(0, 6)
}
