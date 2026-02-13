# Naya Keymap Viewer

A better way to view and understand your Naya Create keyboard layout. See your entire keymap at a glance and customize how keys are displayed to make your layout easier to read and remember.

## Why Use This?

The default NayaFlow app shows your keymap, but it can be hard to quickly understand what each key does—especially with hold key and modifier keys not shown. This viewer lets you:

- **See your full layout** on a visual split keyboard
- **Customize any key's label** with text or icons that make sense to you
- **Replace confusing codes** with clear labels like "Copy", "Paste", or a clipboard icon
- **Browse all layers** to understand your complete keyboard setup

## Features

### Visual Layout

- Split keyboard visualization matching your Naya Create
- Color-coded keys by type (modifiers, layers, special functions)
- View tap and hold actions on the same key

### Customizable Labels

Click any key to customize what's displayed:

- **Text** - Replace labels with your own text (e.g., "Copy" instead of "LCTL(KC_C)")
- **Built-in Icons** - 60+ common icons for media, navigation, and system functions
- **External Icons** - Search 8000+ icons from popular libraries:
  - Lucide (1500+ icons)
  - Heroicons (450+ icons)
  - Tabler (5900+ icons)
  - Feather (286 icons)

Your customizations are saved per-layer and persist between sessions.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/sallf/naya-keymap-visualizer.git
cd naya-keymap-visualizer

# Install dependencies
npm install

# Start development server
npm run dev
```

### Loading Your Keymap

1. Open the app in your browser (default: http://localhost:3000)
2. Locate your Naya Create database file:
   - **macOS**: `~/Library/Application Support/NayaFlow/naya.db`
   - **macOS (Beta)**: `~/Library/Application Support/NayaFlow-Beta/naya.db`
   - **Windows**: `%APPDATA%\NayaFlow\naya.db`
   - **Linux**: `~/.config/NayaFlow/naya.db`
3. Drag and drop the file onto the upload area, or click to browse

## Usage

### Viewing Your Keymap

- **Profile dropdown** - Select which keyboard profile to view
- **Layer dropdown** - Switch between layers (base, symbols, navigation, etc.)
- **Key #s toggle** - Show/hide key position numbers

### Customizing Key Labels

Click any key to open the override modal:

- **Text mode** - Enter custom text (max 10 characters)
- **Icon mode** - Choose from 60+ built-in icons
- **External mode** - Search 8000+ icons from popular libraries:
  - Lucide (1500+ icons)
  - Heroicons (450+ icons)
  - Tabler (5900+ icons)
  - Feather (286 icons)

Overrides are saved per-layer and persist in local storage.

### Key Types

Keys are color-coded by their function:

- **Purple** - Modifiers (Shift, Ctrl, Alt, etc.)
- **Green** - Layer switches
- **Orange** - Special keys (media, system)
- **Gray** - Regular keys

## Development

```bash
# Run development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Project Structure

```
src/
├── components/
│   ├── Keyboard.tsx      # Main keyboard layout
│   ├── Key.tsx           # Individual key component
│   ├── KeyIcon.tsx       # Icon rendering (built-in + external)
│   ├── ManualOverrideModal.tsx  # Override editing UI
│   └── OverridesList.tsx # Active overrides display
├── hooks/
│   ├── useDatabase.ts    # SQLite database loading
│   └── useOverrides.ts   # Override state management
├── types.ts              # TypeScript interfaces
└── App.tsx               # Main application
```

## Tech Stack

- React 18
- TypeScript
- Vite
- Lucide React (icons)
- Iconify API (external icon search)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

- [Lucide](https://lucide.dev/) - Beautiful open source icons
- [Heroicons](https://heroicons.com/) - Icons by the Tailwind CSS team
- [Tabler Icons](https://tabler.io/icons) - 5900+ free icons
- [Feather Icons](https://feathericons.com/) - Simply beautiful icons
- [Iconify](https://iconify.design/) - Universal icon framework and search API
