import * as icons from 'lucide-react'

// Map icon names to Lucide components
const iconMap = {
  // Shortcuts
  'copy': icons.Copy,
  'clipboard-paste': icons.ClipboardPaste,
  'scissors': icons.Scissors,
  'undo-2': icons.Undo2,
  'redo-2': icons.Redo2,
  'save': icons.Save,
  'search': icons.Search,
  'file-plus': icons.FilePlus,
  'folder-open': icons.FolderOpen,
  'printer': icons.Printer,
  'x': icons.X,
  'power': icons.Power,
  'plus': icons.Plus,
  'refresh-cw': icons.RefreshCw,

  // Media
  'volume-2': icons.Volume2,
  'volume-1': icons.Volume1,
  'volume-x': icons.VolumeX,
  'play': icons.Play,
  'skip-forward': icons.SkipForward,
  'skip-back': icons.SkipBack,
  'fast-forward': icons.FastForward,
  'rewind': icons.Rewind,
  'sun': icons.Sun,
  'sun-dim': icons.SunDim,

  // LED
  'lightbulb': icons.Lightbulb,
  'sparkles': icons.Sparkles,
  'waves': icons.Waves,
  'square': icons.Square,
  'loader': icons.Loader,
  'rainbow': icons.Rainbow,
  'gauge': icons.Gauge,

  // Bluetooth / Connectivity
  'bluetooth': icons.Bluetooth,
  'bluetooth-off': icons.BluetoothOff,
  'wifi': icons.Wifi,
  'cable': icons.Cable,

  // OS
  'apple': icons.Apple,
  'app-window': icons.AppWindow,

  // Naya
  'arrow-up-down': icons.ArrowUpDown,
  'sliders-horizontal': icons.SlidersHorizontal,

  // Mac system
  'layout-grid': icons.LayoutGrid,
  'moon': icons.Moon,
  'chevron-left': icons.ChevronLeft,
  'chevron-right': icons.ChevronRight,

  // Misc
  'eye-off': icons.EyeOff,
}

export function KeyIcon({ name, x, y, size = 16, color = '#fff' }) {
  const IconComponent = iconMap[name]

  if (!IconComponent) {
    return null
  }

  return (
    <foreignObject
      x={x - size / 2}
      y={y - size / 2}
      width={size}
      height={size}
    >
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        <IconComponent size={size} color={color} strokeWidth={2} />
      </div>
    </foreignObject>
  )
}
