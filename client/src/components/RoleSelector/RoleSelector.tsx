import { roles, type UserRole } from '../../types/auth'

type RoleSelectorProps = {
  value: UserRole | ''
  onChange: (value: UserRole | '') => void
}

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <div className="form-field">
      <label className="form-label" htmlFor="role">
        Роль
      </label>

      <select
        id="role"
        name="role"
        value={value}
        className="form-input"
        onChange={(e) => onChange(e.target.value as UserRole | '')}
      >
        <option value="">Выберите роль</option>

        {roles.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>
    </div>
  )
}