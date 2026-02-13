import * as icons from 'lucide-react'

// Map icon names to Lucide components
const iconMap = {
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
