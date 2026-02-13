export function Toggle({ checked, onChange, label }) {
  return (
    <label className="toggle-container">
      {label && <span className="toggle-text">{label}</span>}
      <span className="toggle-switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="toggle-slider"></span>
      </span>
    </label>
  )
}
