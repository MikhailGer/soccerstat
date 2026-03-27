interface SearchFieldProps {
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
}

export function SearchField({
  label,
  placeholder,
  value,
  onChange,
}: SearchFieldProps) {
  return (
    <label className="search-field">
      <span className="search-field__label">{label}</span>
      <input
        type="search"
        className="search-field__input"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}
