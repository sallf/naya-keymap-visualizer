import { KEY_LABELS } from './constants'

// Map key (without modifier) to icon names (lucide-react icon names)
// Works for both LGUI (Mac) and LCTRL (Windows)
const SHORTCUT_KEY_ICONS = {
  'C': 'copy',
  'V': 'clipboard-paste',
  'X': 'scissors',
  'Z': 'undo-2',
  'S': 'save',
  'F': 'search',
  'N': 'file-plus',
  'O': 'folder-open',
  'P': 'printer',
  'W': 'x',
  'Q': 'power',
  'T': 'plus',
  'R': 'refresh-cw',
}

// Special multi-modifier shortcuts
const SHORTCUT_ICONS = {
  'LGUI + LSHIFT + Z': 'redo-2',
  'LCTRL + LSHIFT + Z': 'redo-2',
  'LGUI + SHIFT + Z': 'redo-2',
  'LCTRL + SHIFT + Z': 'redo-2',

  // Mac system shortcuts
  'LCTRL + UP': 'layout-grid',           // Mission Control
  'LGUI + SPACE': 'search',              // Spotlight
  'LCTRL + LSHIFT + C_POWER': 'moon',    // Display Sleep
  'LCTRL + DOWN': 'app-window',          // App Exposé
  'LCTRL + LEFT': 'chevron-left',        // Move space left
  'LCTRL + RIGHT': 'chevron-right',      // Move space right
}

// System/media key icons
const SYSTEM_KEY_ICONS = {
  // Media
  'C_VOL_UP': 'volume-2',
  'C_VOL_DOWN': 'volume-1',
  'C_MUTE': 'volume-x',
  'C_PLAY_PAUSE': 'play',
  'C_NEXT': 'skip-forward',
  'C_PREVIOUS': 'skip-back',
  'C_FAST_FORWARD': 'fast-forward',
  'C_REWIND': 'rewind',
  'C_BRIGHTNESS_INC': 'sun',
  'C_BRIGHTNESS_DEC': 'sun-dim',

  // LED
  'LED_EFFECT_ON_OFF': 'lightbulb',
  'LED_EFFECT': 'sparkles',
  'LED_BREATHE': 'waves',
  'LED_SOLID': 'square',
  'LED_SWIRL': 'loader',
  'LED_SPEC': 'rainbow',
  'LED_BRIGHTNESS_UP': 'sun',
  'LED_BRIGHTNESS_DOWN': 'sun-dim',
  'LED_SPEED_UP': 'gauge',
  'LED_SPEED_DOWN': 'gauge',

  // Bluetooth
  'BT_CLEAR': 'bluetooth-off',
  'BT_OUT': 'wifi',
  'BT_DEVICE_1': 'bluetooth',
  'BT_DEVICE_2': 'bluetooth',
  'BT_DEVICE_3': 'bluetooth',
  'BT_DEVICE_4': 'bluetooth',

  // Output
  'USB_DEVICE': 'cable',

  // OS
  'MAC_OS': 'apple',
  'WINDOWS_OS': 'app-window',

  // Naya
  'SCROLL_DIRECTION_L': 'arrow-up-down',
  'SCROLL_DIRECTION_R': 'arrow-up-down',
  'TUNE_MODE_L': 'sliders-horizontal',
  'TUNE_MODE_R': 'sliders-horizontal',
}

// Labels for system keys (shown as text overlay or standalone)
const SYSTEM_KEY_LABELS = {
  'LED_COLOR_RED': '🔴',
  'LED_COLOR_GREEN': '🟢',
  'LED_COLOR_BLUE': '🔵',
  'LED_COLOR_YELLOW': '🟡',
  'LED_COLOR_WHITE': '⚪',
  'BT_DEVICE_1': '1',
  'BT_DEVICE_2': '2',
  'BT_DEVICE_3': '3',
  'BT_DEVICE_4': '4',
}

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
  if (!actionCode) return ''

  // Handle disabled keys
  if (actionType === 'none' && actionCode === 'DISABLE') {
    return '⊘'
  }

  // Handle transparent keys
  if (actionType === 'trans') {
    return { icon: 'eye-off' }
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

  // Handle shortcuts (both shortcut_alias and combo types)
  if (actionType === 'shortcut_alias' || actionType === 'combo') {
    // Check for exact match first (multi-modifier shortcuts with icons)
    if (SHORTCUT_ICONS[actionCode]) {
      return { icon: SHORTCUT_ICONS[actionCode] }
    }

    // Extract the key from shortcuts like "LGUI + C" or "LCTRL + V"
    const iconMatch = actionCode.match(/^(?:LGUI|LCTRL|RGUI|RCTRL) \+ ([A-Z])$/)
    if (iconMatch && SHORTCUT_KEY_ICONS[iconMatch[1]]) {
      return { icon: SHORTCUT_KEY_ICONS[iconMatch[1]] }
    }

    // Parse modifiers
    const hasGui = actionCode.includes('LGUI') || actionCode.includes('RGUI')
    const hasCtrl = actionCode.includes('LCTRL') || actionCode.includes('RCTRL')
    const hasAlt = actionCode.includes('LALT') || actionCode.includes('RALT')
    const hasShift = actionCode.includes('LSHIFT') || actionCode.includes('RSHIFT')

    // Check for Hyper (all four modifiers)
    if (hasGui && hasCtrl && hasAlt && hasShift) {
      // Get the key part (last segment after " + ")
      const parts = actionCode.split(' + ')
      const keyPart = parts[parts.length - 1]
      // If it's just the modifiers with no key, return Hyper
      if (['LSHIFT', 'RSHIFT', 'LGUI', 'RGUI', 'LCTRL', 'RCTRL', 'LALT', 'RALT'].includes(keyPart)) {
        return '✦ Hyper'
      }
      const keyLabel = KEY_LABELS[keyPart] || keyPart
      return { modifiers: '✦', label: keyLabel }
    }

    // Check for Meh (Ctrl+Alt+Shift, no Gui)
    if (!hasGui && hasCtrl && hasAlt && hasShift) {
      const parts = actionCode.split(' + ')
      const keyPart = parts[parts.length - 1]
      if (['LSHIFT', 'RSHIFT', 'LCTRL', 'RCTRL', 'LALT', 'RALT'].includes(keyPart)) {
        return '◆ Meh'
      }
      const keyLabel = KEY_LABELS[keyPart] || keyPart
      return { modifiers: '◆', label: keyLabel }
    }

    const modifiers = []
    if (hasGui) modifiers.push('⌘')
    if (hasCtrl) modifiers.push('⌃')
    if (hasAlt) modifiers.push('⌥')
    if (hasShift) modifiers.push('⇧')

    // Get the key part (last segment after " + ")
    const parts = actionCode.split(' + ')
    const keyPart = parts[parts.length - 1]

    // For shift-only combos, check if it's a symbol shortcut
    if (modifiers.length === 1 && modifiers[0] === '⇧') {
      const shiftMap = {
        'COMMA': '<', 'PERIOD': '>', 'SLASH': '?',
        'SEMICOLON': ':', 'GRAVE': '~', 'SINGLE_QUOTE': '"',
        'LEFT_BRACKET': '{', 'RIGHT_BRACKET': '}',
        'NUMBER_1': '!', 'NUMBER_2': '@', 'NUMBER_3': '#',
        'NUMBER_4': '$', 'NUMBER_5': '%', 'NUMBER_6': '^',
        'NUMBER_7': '&', 'NUMBER_8': '*', 'NUMBER_9': '(', 'NUMBER_0': ')'
      }
      if (shiftMap[keyPart]) {
        return shiftMap[keyPart]
      }
    }

    const keyLabel = KEY_LABELS[keyPart] || keyPart

    if (modifiers.length > 0) {
      return { modifiers: modifiers.join(''), label: keyLabel }
    }

    return keyLabel.substring(0, 6)
  }

  // Check for system key icons
  if (SYSTEM_KEY_ICONS[actionCode]) {
    const label = SYSTEM_KEY_LABELS[actionCode]
    if (label) {
      return { icon: SYSTEM_KEY_ICONS[actionCode], label }
    }
    return { icon: SYSTEM_KEY_ICONS[actionCode] }
  }

  // Check for LED color keys (no icon, just colored text)
  if (SYSTEM_KEY_LABELS[actionCode]) {
    return SYSTEM_KEY_LABELS[actionCode]
  }

  if (KEY_LABELS[actionCode]) {
    return KEY_LABELS[actionCode]
  }

  if (actionCode.length === 1) {
    return actionCode
  }

  return actionCode.replace(/_/g, ' ').substring(0, 6)
}
