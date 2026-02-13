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

// Layout definition - simplified with straight rows
export const LAYOUT = {
  left: [
    // Row 0 - Number row
    { x: 0, y: 0, w: 1, h: 1, pos: 0 },    // Esc
    { x: 1, y: 0, w: 1, h: 1, pos: 1 },    // `~
    { x: 2, y: 0, w: 1, h: 1, pos: 2 },    // 1
    { x: 3, y: 0, w: 1, h: 1, pos: 3 },    // 2
    { x: 4, y: 0, w: 1, h: 1, pos: 4 },    // 3
    { x: 5, y: 0, w: 1, h: 1, pos: 5 },    // 4
    { x: 6, y: 0, w: 1, h: 1, pos: 6 },    // 5

    // Row 1 - QWERTY row
    { x: 0, y: 1, w: 1, h: 1, pos: 16 },   // Tab
    { x: 1, y: 1, w: 1, h: 1, pos: 17 },   // Tab
    { x: 2, y: 1, w: 1, h: 1, pos: 18 },   // Q
    { x: 3, y: 1, w: 1, h: 1, pos: 19 },   // W
    { x: 4, y: 1, w: 1, h: 1, pos: 20 },   // E
    { x: 5, y: 1, w: 1, h: 1, pos: 21 },   // R
    { x: 6, y: 1, w: 1, h: 1, pos: 22 },   // T
    { x: 7, y: 0, w: 1, h: 2, pos: 7 },    // Right Click (double height, starts at row 0)

    // Row 2 - ASDF row
    { x: 0, y: 2, w: 1, h: 1, pos: 30 },   // Caps
    { x: 1, y: 2, w: 1, h: 1, pos: 31 },   // Caps
    { x: 2, y: 2, w: 1, h: 1, pos: 32 },   // A
    { x: 3, y: 2, w: 1, h: 1, pos: 33 },   // S
    { x: 4, y: 2, w: 1, h: 1, pos: 34 },   // D
    { x: 5, y: 2, w: 1, h: 1, pos: 35 },   // F
    { x: 6, y: 2, w: 1, h: 1, pos: 36 },   // G

    // Row 3 - ZXCV row
    { x: 0, y: 3, w: 1, h: 1, pos: 46 },   // Shift
    { x: 1, y: 3, w: 1, h: 1, pos: 47 },   // Shift
    { x: 2, y: 3, w: 1, h: 1, pos: 48 },   // Z
    { x: 3, y: 3, w: 1, h: 1, pos: 49 },   // X
    { x: 4, y: 3, w: 1, h: 1, pos: 50 },   // C
    { x: 5, y: 3, w: 1, h: 1, pos: 51 },   // V
    { x: 6, y: 3, w: 1, h: 1, pos: 52 },   // B

    // Row 4 - Bottom row
    { x: 0, y: 4, w: 1, h: 1, pos: 62 },
    { x: 1, y: 4, w: 1, h: 1, pos: 63 },
    { x: 2, y: 4, w: 1, h: 1, pos: 64 },
    { x: 3, y: 4, w: 1, h: 1, pos: 65 },
    { x: 4, y: 4, w: 2, h: 1, pos: 66 },   // Tab (double width)

    // Thumb cluster (row 5, separate from main keys) - L to R: Layer 1, Layer 2, Shift
    { x: 5, y: 5, w: 1, h: 1, pos: 37 },   // Layer 1
    { x: 6, y: 5, w: 1, h: 1, pos: 53 },   // Layer 2
    { x: 7, y: 5, w: 1, h: 1, pos: 67 },   // Shift
  ],

  right: [
    // Row 0 - Number row
    { x: 1, y: 0, w: 1, h: 1, pos: 9 },    // 6
    { x: 2, y: 0, w: 1, h: 1, pos: 10 },   // 7
    { x: 3, y: 0, w: 1, h: 1, pos: 11 },   // 8
    { x: 4, y: 0, w: 1, h: 1, pos: 12 },   // 9
    { x: 5, y: 0, w: 1, h: 1, pos: 13 },   // 0
    { x: 6, y: 0, w: 1, h: 1, pos: 14 },   // -
    { x: 7, y: 0, w: 1, h: 1, pos: 15 },   // =

    // Row 1 - YUIOP row
    { x: 0, y: 0, w: 1, h: 2, pos: 8 },    // Left Click (double height, starts at row 0)
    { x: 1, y: 1, w: 1, h: 1, pos: 23 },   // Y
    { x: 2, y: 1, w: 1, h: 1, pos: 24 },   // U
    { x: 3, y: 1, w: 1, h: 1, pos: 25 },   // I
    { x: 4, y: 1, w: 1, h: 1, pos: 26 },   // O
    { x: 5, y: 1, w: 1, h: 1, pos: 27 },   // P
    { x: 6, y: 1, w: 1, h: 1, pos: 28 },   // [
    { x: 7, y: 1, w: 1, h: 1, pos: 29 },   // ]

    // Row 2 - HJKL row
    { x: 1, y: 2, w: 1, h: 1, pos: 39 },   // H
    { x: 2, y: 2, w: 1, h: 1, pos: 40 },   // J
    { x: 3, y: 2, w: 1, h: 1, pos: 41 },   // K
    { x: 4, y: 2, w: 1, h: 1, pos: 42 },   // L
    { x: 5, y: 2, w: 1, h: 1, pos: 43 },   // ;
    { x: 6, y: 2, w: 1, h: 1, pos: 44 },   // '
    { x: 7, y: 2, w: 1, h: 1, pos: 45 },   // backslash

    // Row 3 - NM row
    { x: 1, y: 3, w: 1, h: 1, pos: 55 },   // N
    { x: 2, y: 3, w: 1, h: 1, pos: 56 },   // M
    { x: 3, y: 3, w: 1, h: 1, pos: 57 },   // ,
    { x: 4, y: 3, w: 1, h: 1, pos: 58 },   // .
    { x: 5, y: 3, w: 1, h: 1, pos: 59 },   // /
    { x: 6, y: 3, w: 1, h: 1, pos: 60 },   // Shift
    { x: 7, y: 3, w: 1, h: 1, pos: 61 },   // Shift

    // Row 5 - Thumb cluster (separate from main keys) - L to R: Del, Backspace, Return
    { x: 0, y: 5, w: 1, h: 1, pos: 68 },   // Del (fn+del)
    { x: 1, y: 5, w: 1, h: 1, pos: 54 },   // Backspace
    { x: 2, y: 5, w: 1, h: 1, pos: 38 },   // Return

    { x: 2, y: 4, w: 2, h: 1, pos: 69 },   // Space (double width under M and ,)
    { x: 4, y: 4, w: 1, h: 1, pos: 70 },
    { x: 5, y: 4, w: 1, h: 1, pos: 71 },
    { x: 6, y: 4, w: 1, h: 1, pos: 72 },
    { x: 7, y: 4, w: 1, h: 1, pos: 73 },
  ],
}
