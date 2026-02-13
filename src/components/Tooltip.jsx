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
          <div className="tt-action">{data.press.actionCode || '-'}</div>
          <div className="tt-type">Type: {data.press.actionType} | Position: {pos}</div>
        </>
      )}
      {data.hold && (
        <div className="tt-hold">Hold: {data.hold.actionCode}</div>
      )}
    </div>
  )
}
