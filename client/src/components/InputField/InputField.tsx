type InputFieldProps = {
  label: string
  name: string
  type?: string
  value: string
  placeholder?: string
  onChange: (value: string) => void
}

export function InputField({
  label,
  name,
  type = 'text',
  value,
  placeholder,
  onChange,
}: InputFieldProps) {
  return (
    <div className="form-field">
      <label className="form-label" htmlFor={name}>
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        className="form-input"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}