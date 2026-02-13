import * as icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// Helper to get external icon URL
export function getExternalIconUrl(library: string, iconName: string): string {
  switch (library) {
    case 'lucide':
      return `https://cdn.jsdelivr.net/npm/lucide-static/icons/${iconName}.svg`
    case 'heroicons':
      return `https://cdn.jsdelivr.net/npm/heroicons@2.2.0/24/outline/${iconName}.svg`
    case 'tabler':
      return `https://cdn.jsdelivr.net/npm/@tabler/icons@latest/icons/outline/${iconName}.svg`
    case 'feather':
      return `https://cdn.jsdelivr.net/npm/feather-icons/dist/icons/${iconName}.svg`
    default:
      return ''
  }
}

// Parse external icon value (e.g., "simpleicons:slack" -> { library: "simpleicons", name: "slack" })
export function parseExternalIcon(value: string): { library: string; name: string } | null {
  if (!value.includes(':')) return null
  const [library, name] = value.split(':')
  return { library, name }
}

// Map icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
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

interface KeyIconProps {
  name: string
  x: number
  y: number
  size?: number
  color?: string
}

export function KeyIcon({ name, x, y, size = 16, color = '#fff' }: KeyIconProps) {
  // Check if it's an external icon
  const externalIcon = parseExternalIcon(name)
  if (externalIcon) {
    const url = getExternalIconUrl(externalIcon.library, externalIcon.name)

    return (
      <foreignObject
        x={x - size / 2}
        y={y - size / 2}
        width={size}
        height={size}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          <img
            src={url}
            alt={externalIcon.name}
            width={size}
            height={size}
            style={{
              // Apply CSS filter to make stroke icons white (or other color)
              filter: color === '#fff' ? 'brightness(0) invert(1)' : undefined,
            }}
          />
        </div>
      </foreignObject>
    )
  }

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
