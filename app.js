// Naya Keymap Viewer
// Reads directly from the NayaFlow SQLite database and renders as SVG

let db = null;
let currentProfile = null;
let currentLayer = null;
let keyData = new Map();

// Key display name mappings
const KEY_LABELS = {
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
};

// SVG Layout Configuration
// Based on the Naya keyboard image - columnar stagger split keyboard
// Key unit size
const U = 44; // Base unit size in pixels
const GAP = 4; // Gap between keys
const RADIUS = 6; // Corner radius

// Layout definition: each key has [x, y, width, height, positionId]
// Coordinates are in key units, will be multiplied by (U + GAP)
// The layout matches the physical keyboard image

const LAYOUT = {
  left: [
    // Far left column (small keys)
    { x: 0, y: 0, w: 0.85, h: 1, pos: 0 },      // Esc
    { x: 0, y: 1.1, w: 0.85, h: 1, pos: 16 },   // Tab-arrow
    { x: 0, y: 2.2, w: 0.85, h: 1, pos: 30 },   // Caps-arrow
    { x: 0, y: 3.3, w: 0.85, h: 1, pos: 46 },   // Esc
    { x: 0, y: 4.4, w: 0.85, h: 1, pos: 62 },   // Square
    { x: 0, y: 5.5, w: 0.85, h: 1, pos: 63 },   // Arrow

    // Second column
    { x: 1, y: 0.3, w: 1, h: 1, pos: 1 },       // `~
    { x: 1, y: 1.4, w: 1, h: 1, pos: 17 },      // Tab
    { x: 1, y: 2.5, w: 1, h: 1, pos: 31 },      // Caps
    { x: 1, y: 3.6, w: 1, h: 1, pos: 47 },      // Shift
    { x: 1, y: 4.7, w: 1, h: 1, pos: 64 },      // Cmd

    // Third column (numbers start)
    { x: 2.1, y: 0, w: 1, h: 1, pos: 2 },       // 1
    { x: 2.1, y: 1.1, w: 1, h: 1, pos: 18 },    // Q
    { x: 2.1, y: 2.2, w: 1, h: 1, pos: 32 },    // A
    { x: 2.1, y: 3.3, w: 1, h: 1, pos: 48 },    // Z
    { x: 2.1, y: 4.7, w: 1, h: 1, pos: 65 },    // Alt

    // Fourth column
    { x: 3.2, y: 0, w: 1, h: 1, pos: 3 },       // 2
    { x: 3.2, y: 1.1, w: 1, h: 1, pos: 19 },    // W
    { x: 3.2, y: 2.2, w: 1, h: 1, pos: 33 },    // S
    { x: 3.2, y: 3.3, w: 1, h: 1, pos: 49 },    // X

    // Fifth column
    { x: 4.3, y: 0, w: 1, h: 1, pos: 4 },       // 3
    { x: 4.3, y: 1.1, w: 1, h: 1, pos: 20 },    // E
    { x: 4.3, y: 2.2, w: 1, h: 1, pos: 34 },    // D
    { x: 4.3, y: 3.3, w: 1, h: 1, pos: 50 },    // C

    // Sixth column
    { x: 5.4, y: 0, w: 1, h: 1, pos: 5 },       // 4
    { x: 5.4, y: 1.1, w: 1, h: 1, pos: 21 },    // R
    { x: 5.4, y: 2.2, w: 1, h: 1, pos: 35 },    // F
    { x: 5.4, y: 3.3, w: 1, h: 1, pos: 51 },    // V

    // Seventh column
    { x: 6.5, y: 0, w: 1, h: 1, pos: 6 },       // 5
    { x: 6.5, y: 1.1, w: 1, h: 1, pos: 22 },    // T
    { x: 6.5, y: 2.2, w: 1, h: 1, pos: 36 },    // G
    { x: 6.5, y: 3.3, w: 1, h: 1, pos: 52 },    // B

    // Eighth column (inner keys - mouse buttons)
    { x: 7.6, y: 1.1, w: 1, h: 1.5, pos: 7 },   // M2 Right Click (tall key)

    // Left thumb cluster (3 keys) - Hold Layer 1, Hold Layer 2, Shift
    { x: 4.5, y: 5.2, w: 1, h: 1, pos: 37 },    // Hold Layer 1
    { x: 5.6, y: 5.2, w: 1, h: 1, pos: 53 },    // Hold Layer 2
    { x: 6.7, y: 5.2, w: 1, h: 1, pos: 67 },    // Shift
  ],

  right: [
    // First column (inner key - mouse button)
    { x: 0, y: 1.1, w: 1, h: 1.5, pos: 8 },     // M1 Left Click (tall key)

    // Second column (Y column)
    { x: 1.1, y: 0, w: 1, h: 1, pos: 9 },       // 6
    { x: 1.1, y: 1.1, w: 1, h: 1, pos: 23 },    // Y
    { x: 1.1, y: 2.2, w: 1, h: 1, pos: 39 },    // H
    { x: 1.1, y: 3.3, w: 1, h: 1, pos: 55 },    // N

    // Third column (U column)
    { x: 2.2, y: 0, w: 1, h: 1, pos: 10 },      // 7
    { x: 2.2, y: 1.1, w: 1, h: 1, pos: 24 },    // U
    { x: 2.2, y: 2.2, w: 1, h: 1, pos: 40 },    // J
    { x: 2.2, y: 3.3, w: 1, h: 1, pos: 56 },    // M

    // Fourth column (I column)
    { x: 3.3, y: 0, w: 1, h: 1, pos: 11 },      // 8
    { x: 3.3, y: 1.1, w: 1, h: 1, pos: 25 },    // I
    { x: 3.3, y: 2.2, w: 1, h: 1, pos: 41 },    // K
    { x: 3.3, y: 3.3, w: 1, h: 1, pos: 57 },    // ,

    // Fifth column (O column)
    { x: 4.4, y: 0, w: 1, h: 1, pos: 12 },      // 9
    { x: 4.4, y: 1.1, w: 1, h: 1, pos: 26 },    // O
    { x: 4.4, y: 2.2, w: 1, h: 1, pos: 42 },    // L
    { x: 4.4, y: 3.3, w: 1, h: 1, pos: 58 },    // .

    // Sixth column (P column)
    { x: 5.5, y: 0, w: 1, h: 1, pos: 13 },      // 0
    { x: 5.5, y: 1.1, w: 1, h: 1, pos: 27 },    // P
    { x: 5.5, y: 2.2, w: 1, h: 1, pos: 43 },    // ;
    { x: 5.5, y: 3.3, w: 1, h: 1, pos: 59 },    // /

    // Seventh column ([ column)
    { x: 6.6, y: 0.3, w: 1, h: 1, pos: 14 },    // -
    { x: 6.6, y: 1.4, w: 1, h: 1, pos: 28 },    // [
    { x: 6.6, y: 2.5, w: 1, h: 1, pos: 44 },    // '
    { x: 6.6, y: 3.6, w: 1, h: 1, pos: 60 },    // Shift
    { x: 6.6, y: 4.7, w: 1, h: 1, pos: 70 },    // Cmd

    // Eighth column (] column)
    { x: 7.7, y: 0.3, w: 1, h: 1, pos: 15 },    // =+
    { x: 7.7, y: 1.4, w: 1, h: 1, pos: 29 },    // ]
    { x: 7.7, y: 2.5, w: 1, h: 1, pos: 45 },    // backslash
    { x: 7.7, y: 3.6, w: 1, h: 1, pos: 61 },    // Shift
    { x: 7.7, y: 4.7, w: 1, h: 1, pos: 71 },    // Alt

    // Far right column (small keys)
    { x: 8.8, y: 0.3, w: 0.85, h: 1, pos: 69 },   // Space
    { x: 8.8, y: 1.4, w: 0.85, h: 1, pos: 66 },   // Tab
    { x: 8.8, y: 2.5, w: 0.85, h: 1, pos: 72 },   // Ctrl
    { x: 8.8, y: 3.6, w: 0.85, h: 1, pos: 73 },   // Layer 3

    // Right thumb cluster (3 keys) - fn+delete, delete, return
    { x: 1.1, y: 4.7, w: 1, h: 1, pos: 68 },    // fn+delete (DELETE key)
    { x: 2.2, y: 4.7, w: 1, h: 1, pos: 54 },    // delete (BACKSPACE)
    { x: 3.3, y: 4.7, w: 1, h: 1, pos: 38 },    // Return
  ],
};

// We need to verify position IDs by checking the actual DB data
// This will be refined after seeing actual output

async function initDatabase() {
  const loading = document.getElementById('loading');
  const error = document.getElementById('error');

  try {
    const SQL = await initSqlJs({
      locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
    });

    const response = await fetch('user-data-beta.db');
    if (!response.ok) {
      throw new Error(`Could not load database file`);
    }

    const buffer = await response.arrayBuffer();
    db = new SQL.Database(new Uint8Array(buffer));

    loading.classList.add('hidden');
    await loadProfiles();

  } catch (e) {
    loading.classList.add('hidden');
    error.style.display = 'block';
    error.innerHTML = `<strong>Error:</strong> ${e.message}<br><br>
      <strong>Setup:</strong><br>
      1. <code>cp "~/Library/Application Support/NayaFlow-Beta/user-data-beta.db" .</code><br>
      2. <code>npx serve</code>`;
    console.error(e);
  }
}

async function loadProfiles() {
  const select = document.getElementById('profile-select');
  const results = db.exec('SELECT id, name FROM profiles ORDER BY name');

  if (results.length === 0) return;

  const profiles = results[0].values;
  select.innerHTML = profiles.map(([id, name]) =>
    `<option value="${id}">${name}</option>`
  ).join('');

  select.addEventListener('change', () => {
    currentProfile = select.value;
    loadLayers(currentProfile);
  });

  currentProfile = profiles[0][0];
  await loadLayers(currentProfile);
}

async function loadLayers(profileId) {
  const select = document.getElementById('layer-select');
  const results = db.exec(`
    SELECT id, name, order_id
    FROM layers
    WHERE profile_id = '${profileId}'
    ORDER BY order_id
  `);

  if (results.length === 0) return;

  const layers = results[0].values;
  select.innerHTML = layers.map(([id, name, order]) =>
    `<option value="${id}">${order}: ${name}</option>`
  ).join('');

  // Remove old listener and add new one
  const newSelect = select.cloneNode(true);
  select.parentNode.replaceChild(newSelect, select);

  newSelect.addEventListener('change', () => {
    currentLayer = newSelect.value;
    renderKeyboard(currentLayer);
  });

  currentLayer = layers[0][0];
  await renderKeyboard(currentLayer);
}

async function renderKeyboard(layerId) {
  // Get all keys with both press and hold bindings
  const results = db.exec(`
    SELECT k.position_id, kb.action_code, kb.action_type, kb.behavior, k.color_hex
    FROM keys k
    LEFT JOIN key_bindings kb ON k.id = kb.key_id
    WHERE k.layer_id = '${layerId}'
    ORDER BY k.position_id, kb.behavior
  `);

  // Build a map of position -> {press: {...}, hold: {...}}
  keyData = new Map();
  if (results.length > 0) {
    for (const [posId, actionCode, actionType, behavior, colorHex] of results[0].values) {
      if (!keyData.has(posId)) {
        keyData.set(posId, { press: null, hold: null });
      }
      const binding = { actionCode, actionType, colorHex };
      if (behavior === 'hold') {
        keyData.get(posId).hold = binding;
      } else {
        keyData.get(posId).press = binding;
      }
    }
  }

  renderSVG();
}

function renderSVG() {
  const wrapper = document.getElementById('keyboard');

  // Calculate SVG dimensions
  const leftWidth = 9 * (U + GAP);  // Added column for mouse button
  const rightWidth = 10 * (U + GAP);
  const height = 6.5 * (U + GAP);
  const centerGap = 60;
  const totalWidth = leftWidth + centerGap + rightWidth + 40;

  let svg = `<svg class="keyboard-svg" viewBox="0 0 ${totalWidth} ${height}" xmlns="http://www.w3.org/2000/svg">`;

  // Render left half
  svg += `<g class="left-half" transform="translate(20, 20)">`;
  for (const key of LAYOUT.left) {
    svg += renderKey(key, 0);
  }
  svg += `</g>`;

  // Render right half
  svg += `<g class="right-half" transform="translate(${leftWidth + centerGap}, 20)">`;
  for (const key of LAYOUT.right) {
    svg += renderKey(key, 0);
  }
  svg += `</g>`;

  svg += `</svg>`;

  wrapper.innerHTML = svg;

  // Add hover tooltips
  addTooltips();
}

function renderKey(keyDef, offsetX) {
  const { x, y, w, h, pos } = keyDef;
  const data = keyData.get(pos);

  const px = x * (U + GAP);
  const py = y * (U + GAP);
  const width = w * U + (w - 1) * GAP;
  const height = h * U + (h - 1) * GAP;

  const typeClass = data?.press ? getTypeClass(data.press.actionType) : 'none';
  const label = data?.press ? getKeyLabel(data.press.actionCode, data.press.actionType) : '-';
  const hasHold = data?.hold != null;

  // Determine if label needs to be smaller
  const labelClass = label.length > 4 ? 'small' : '';

  let svg = `<g class="key-group ${typeClass}" data-pos="${pos}" data-press="${data?.press?.actionCode || ''}" data-hold="${data?.hold?.actionCode || ''}">`;

  // Key shape
  svg += `<rect class="key-shape" x="${px}" y="${py}" width="${width}" height="${height}" rx="${RADIUS}"/>`;

  // Main label
  const labelY = hasHold ? py + height * 0.4 : py + height / 2;
  svg += `<text class="key-label ${labelClass}" x="${px + width/2}" y="${labelY}">${escapeHtml(label)}</text>`;

  // Hold indicator (three dots in a box)
  if (hasHold) {
    const holdY = py + height * 0.75;
    const boxW = 20;
    const boxH = 10;
    svg += `<rect class="hold-badge" x="${px + width/2 - boxW/2}" y="${holdY - boxH/2}" width="${boxW}" height="${boxH}" rx="2"/>`;
    svg += `<text class="hold-indicator" x="${px + width/2}" y="${holdY + 1}">•••</text>`;
  }

  // Position ID (small, for debugging)
  svg += `<text class="key-sublabel" x="${px + width/2}" y="${py + height - 4}">${pos}</text>`;

  svg += `</g>`;

  return svg;
}

function getTypeClass(actionType) {
  switch (actionType) {
    case 'modifier': return 'modifier';
    case 'layer_polite_hold': return 'layer';
    case 'none': return 'none';
    case 'trans': return 'trans';
    case 'LED':
    case 'naya':
    case 'bluetooth':
    case 'out':
      return 'special';
    default: return '';
  }
}

function getKeyLabel(actionCode, actionType) {
  if (!actionCode) return '-';

  if (actionType === 'layer_polite_hold' && actionCode.startsWith('MO_LAYER_')) {
    return 'Layer';
  }

  if (actionType === 'shortcut_alias') {
    // Clean up shortcut names
    return actionCode.replace(/LGUI \+ |LSHIFT \+ |LCTRL \+ |LALT \+ /g, '').substring(0, 6);
  }

  if (actionType === 'combo') {
    // Show the resulting character for combos like LSHIFT + COMMA
    const match = actionCode.match(/LSHIFT \+ (\w+)/);
    if (match) {
      const base = match[1];
      const shiftMap = {
        'COMMA': '<', 'PERIOD': '>', 'SLASH': '?',
        'SEMICOLON': ':', 'GRAVE': '~',
        '1': '!', '2': '@', '3': '#', '4': '$', '5': '%',
        '6': '^', '7': '&', '8': '*', '9': '(', '0': ')'
      };
      return shiftMap[base] || actionCode.substring(0, 6);
    }
    return actionCode.substring(0, 6);
  }

  if (KEY_LABELS[actionCode]) {
    return KEY_LABELS[actionCode];
  }

  if (actionCode.length === 1) {
    return actionCode;
  }

  return actionCode.replace(/_/g, ' ').substring(0, 6);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function addTooltips() {
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.style.display = 'none';
  document.body.appendChild(tooltip);

  document.querySelectorAll('.key-group').forEach(group => {
    group.addEventListener('mouseenter', (e) => {
      const pos = group.dataset.pos;
      const data = keyData.get(parseInt(pos));

      if (!data) return;

      let html = '';
      if (data.press) {
        html += `<div class="tt-action">${data.press.actionCode || '-'}</div>`;
        html += `<div class="tt-type">Type: ${data.press.actionType} | Position: ${pos}</div>`;
      }
      if (data.hold) {
        html += `<div class="tt-hold">Hold: ${data.hold.actionCode}</div>`;
      }

      tooltip.innerHTML = html;
      tooltip.style.display = 'block';
    });

    group.addEventListener('mousemove', (e) => {
      tooltip.style.left = (e.clientX + 10) + 'px';
      tooltip.style.top = (e.clientY + 10) + 'px';
    });

    group.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
    });
  });
}

document.addEventListener('DOMContentLoaded', initDatabase);
