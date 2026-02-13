// Key display name mappings
export const KEY_LABELS = {
  'ESC': 'Esc',
  'GRAVE': '`~',
  'NUMBER_1': '1', 'NUMBER_2': '2', 'NUMBER_3': '3', 'NUMBER_4': '4', 'NUMBER_5': '5',
  'NUMBER_6': '6', 'NUMBER_7': '7', 'NUMBER_8': '8', 'NUMBER_9': '9', 'NUMBER_0': '0',
  'MINUS': '-', 'EQUAL': '=', 'PLUS': '+', 'UNDERSCORE': '_',
  'EXCLAMATION': '!', 'AT_SIGN': '@', 'HASH': '#', 'DOLLAR': '$', 'PERCENT': '%',
  'CARET': '^', 'AMPERSAND': '&', 'ASTERISK': '*',
  'LEFT_PARENTHESIS': '(', 'RIGHT_PARENTHESIS': ')',
  'TAB': 'Tab',
  'LEFT_BRACKET': '[', 'RIGHT_BRACKET': ']',
  'LEFT_BRACE': '{', 'RIGHT_BRACE': '}',
  'CAPSLOCK': 'Caps',
  'SEMICOLON': ';', 'SINGLE_QUOTE': "'", 'DOUBLE_QUOTES': '"',
  'COLON': ':',
  'BACKSLASH': '\\', 'PIPE': '|',
  'LSHIFT': 'Shift', 'RSHIFT': 'Shift',
  'LCTRL': 'Ctrl', 'RCTRL': 'Ctrl',
  'LALT': 'Alt', 'RALT': 'Alt',
  'LGUI': '⌘', 'RGUI': '⌘',
  'SPACE': 'Space',
  'RETURN': '↵',
  'BACKSPACE': '⌫',
  'DELETE': 'Del',
  'COMMA': ',', 'PERIOD': '.', 'SLASH': '/',
  'LESS_THAN': '<', 'GREATER_THAN': '>',
  'QUESTION': '?',
  'UP': '↑', 'DOWN': '↓', 'LEFT': '←', 'RIGHT': '→',
  'PG_UP': 'PgUp', 'PG_DOWN': 'PgDn',
  'HOME': 'Home', 'END': 'End',
  'INSERT': 'Ins',
  'PRINT_SCREEN': 'PrtSc',
  'SCROLL_LOCK': 'ScrLk',
  'PAUSE': 'Pause',
  'KP_MULTIPLY': '*', 'KP_DIVIDE': '/', 'KP_PLUS': '+', 'KP_MINUS': '-',
  'KP_0': '0', 'KP_1': '1', 'KP_2': '2', 'KP_3': '3', 'KP_4': '4',
  'KP_5': '5', 'KP_6': '6', 'KP_7': '7', 'KP_8': '8', 'KP_9': '9',
  'KP_DOT': '.', 'KP_ENTER': '↵',
  'F1': 'F1', 'F2': 'F2', 'F3': 'F3', 'F4': 'F4', 'F5': 'F5', 'F6': 'F6',
  'F7': 'F7', 'F8': 'F8', 'F9': 'F9', 'F10': 'F10', 'F11': 'F11', 'F12': 'F12',
  'OPEN_PAREN': '(', 'CLOSE_PAREN': ')',
  'VOL_UP': '🔊', 'VOL_DOWN': '🔉', 'MUTE': '🔇',
  'PLAY_PAUSE': '⏯', 'NEXT_TRACK': '⏭', 'PREV_TRACK': '⏮',
  'M1': 'L Click', 'M2': 'R Click',
}

// SVG Layout Configuration
export const U = 44 // Base unit size in pixels
export const GAP = 4 // Gap between keys
export const RADIUS = 6 // Corner radius

// Layout definition
export const LAYOUT = {
  left: [
    // Far left column (small keys)
    { x: 0, y: 0, w: 0.85, h: 1, pos: 0 },
    { x: 0, y: 1.1, w: 0.85, h: 1, pos: 16 },
    { x: 0, y: 2.2, w: 0.85, h: 1, pos: 30 },
    { x: 0, y: 3.3, w: 0.85, h: 1, pos: 46 },
    { x: 0, y: 4.4, w: 0.85, h: 1, pos: 62 },
    { x: 0, y: 5.5, w: 0.85, h: 1, pos: 63 },

    // Second column
    { x: 1, y: 0.3, w: 1, h: 1, pos: 1 },
    { x: 1, y: 1.4, w: 1, h: 1, pos: 17 },
    { x: 1, y: 2.5, w: 1, h: 1, pos: 31 },
    { x: 1, y: 3.6, w: 1, h: 1, pos: 47 },
    { x: 1, y: 4.7, w: 1, h: 1, pos: 64 },

    // Third column
    { x: 2.1, y: 0, w: 1, h: 1, pos: 2 },
    { x: 2.1, y: 1.1, w: 1, h: 1, pos: 18 },
    { x: 2.1, y: 2.2, w: 1, h: 1, pos: 32 },
    { x: 2.1, y: 3.3, w: 1, h: 1, pos: 48 },
    { x: 2.1, y: 4.7, w: 1, h: 1, pos: 65 },

    // Fourth column
    { x: 3.2, y: 0, w: 1, h: 1, pos: 3 },
    { x: 3.2, y: 1.1, w: 1, h: 1, pos: 19 },
    { x: 3.2, y: 2.2, w: 1, h: 1, pos: 33 },
    { x: 3.2, y: 3.3, w: 1, h: 1, pos: 49 },

    // Fifth column
    { x: 4.3, y: 0, w: 1, h: 1, pos: 4 },
    { x: 4.3, y: 1.1, w: 1, h: 1, pos: 20 },
    { x: 4.3, y: 2.2, w: 1, h: 1, pos: 34 },
    { x: 4.3, y: 3.3, w: 1, h: 1, pos: 50 },

    // Sixth column
    { x: 5.4, y: 0, w: 1, h: 1, pos: 5 },
    { x: 5.4, y: 1.1, w: 1, h: 1, pos: 21 },
    { x: 5.4, y: 2.2, w: 1, h: 1, pos: 35 },
    { x: 5.4, y: 3.3, w: 1, h: 1, pos: 51 },

    // Seventh column
    { x: 6.5, y: 0, w: 1, h: 1, pos: 6 },
    { x: 6.5, y: 1.1, w: 1, h: 1, pos: 22 },
    { x: 6.5, y: 2.2, w: 1, h: 1, pos: 36 },
    { x: 6.5, y: 3.3, w: 1, h: 1, pos: 52 },

    // Eighth column (inner key - mouse button)
    { x: 7.6, y: 1.1, w: 1, h: 1.5, pos: 7 },

    // Left thumb cluster
    { x: 4.5, y: 5.2, w: 1, h: 1, pos: 37 },
    { x: 5.6, y: 5.2, w: 1, h: 1, pos: 53 },
    { x: 6.7, y: 5.2, w: 1, h: 1, pos: 67 },
  ],

  right: [
    // First column (inner key - mouse button)
    { x: 0, y: 1.1, w: 1, h: 1.5, pos: 8 },

    // Second column (Y column)
    { x: 1.1, y: 0, w: 1, h: 1, pos: 9 },
    { x: 1.1, y: 1.1, w: 1, h: 1, pos: 23 },
    { x: 1.1, y: 2.2, w: 1, h: 1, pos: 39 },
    { x: 1.1, y: 3.3, w: 1, h: 1, pos: 55 },

    // Third column (U column)
    { x: 2.2, y: 0, w: 1, h: 1, pos: 10 },
    { x: 2.2, y: 1.1, w: 1, h: 1, pos: 24 },
    { x: 2.2, y: 2.2, w: 1, h: 1, pos: 40 },
    { x: 2.2, y: 3.3, w: 1, h: 1, pos: 56 },

    // Fourth column (I column)
    { x: 3.3, y: 0, w: 1, h: 1, pos: 11 },
    { x: 3.3, y: 1.1, w: 1, h: 1, pos: 25 },
    { x: 3.3, y: 2.2, w: 1, h: 1, pos: 41 },
    { x: 3.3, y: 3.3, w: 1, h: 1, pos: 57 },

    // Fifth column (O column)
    { x: 4.4, y: 0, w: 1, h: 1, pos: 12 },
    { x: 4.4, y: 1.1, w: 1, h: 1, pos: 26 },
    { x: 4.4, y: 2.2, w: 1, h: 1, pos: 42 },
    { x: 4.4, y: 3.3, w: 1, h: 1, pos: 58 },

    // Sixth column (P column)
    { x: 5.5, y: 0, w: 1, h: 1, pos: 13 },
    { x: 5.5, y: 1.1, w: 1, h: 1, pos: 27 },
    { x: 5.5, y: 2.2, w: 1, h: 1, pos: 43 },
    { x: 5.5, y: 3.3, w: 1, h: 1, pos: 59 },

    // Seventh column ([ column)
    { x: 6.6, y: 0.3, w: 1, h: 1, pos: 14 },
    { x: 6.6, y: 1.4, w: 1, h: 1, pos: 28 },
    { x: 6.6, y: 2.5, w: 1, h: 1, pos: 44 },
    { x: 6.6, y: 3.6, w: 1, h: 1, pos: 60 },
    { x: 6.6, y: 4.7, w: 1, h: 1, pos: 70 },

    // Eighth column (] column)
    { x: 7.7, y: 0.3, w: 1, h: 1, pos: 15 },
    { x: 7.7, y: 1.4, w: 1, h: 1, pos: 29 },
    { x: 7.7, y: 2.5, w: 1, h: 1, pos: 45 },
    { x: 7.7, y: 3.6, w: 1, h: 1, pos: 61 },
    { x: 7.7, y: 4.7, w: 1, h: 1, pos: 71 },

    // Far right column (small keys)
    { x: 8.8, y: 0.3, w: 0.85, h: 1, pos: 69 },
    { x: 8.8, y: 1.4, w: 0.85, h: 1, pos: 66 },
    { x: 8.8, y: 2.5, w: 0.85, h: 1, pos: 72 },
    { x: 8.8, y: 3.6, w: 0.85, h: 1, pos: 73 },

    // Right thumb cluster
    { x: 1.1, y: 4.7, w: 1, h: 1, pos: 68 },
    { x: 2.2, y: 4.7, w: 1, h: 1, pos: 54 },
    { x: 3.3, y: 4.7, w: 1, h: 1, pos: 38 },
  ],
}
