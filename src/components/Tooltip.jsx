// Make action codes more human readable
function formatActionCode(actionCode) {
  if (!actionCode) return '-'

  return actionCode
    .replace(/LGUI/g, 'Cmd')
    .replace(/RGUI/g, 'Cmd R')
    .replace(/LCTRL/g, 'Ctrl')
    .replace(/RCTRL/g, 'Ctrl R')
    .replace(/LALT/g, 'Alt')
    .replace(/RALT/g, 'Alt R')
    .replace(/LSHIFT/g, 'Shift')
    .replace(/RSHIFT/g, 'Shift R')
    .replace(/_/g, ' ')
}

export function Tooltip({ pos, data, x, y }) {
  if (!data) return null

  return (
    <div
      className="tooltip"
      style={{
        left: x + 10,
        top: y + 10
      }}
    >
      {data.press && (
        <>
          <div className="tt-action">{formatActionCode(data.press.actionCode)}</div>
          <div className="tt-type">Position: {pos}</div>
        </>
      )}
      {data.hold && (
        <div className="tt-hold">Hold: {formatActionCode(data.hold.actionCode)}</div>
      )}
    </div>
  )
}
