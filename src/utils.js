import { KEY_LABELS } from './constants'

export function getTypeClass(actionType) {
  switch (actionType) {
    case 'modifier': return 'modifier'
    case 'layer_polite_hold': return 'layer'
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

export function getKeyLabel(actionCode, actionType) {
  if (!actionCode) return '-'

  if (actionType === 'layer_polite_hold' && actionCode.startsWith('MO_LAYER_')) {
    return 'Layer'
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
