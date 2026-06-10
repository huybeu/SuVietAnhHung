// src/components/article/HeroDropdownFilter.jsx
import { useHeroOptions } from '../../hooks/useHeroOptions'

export default function HeroDropdownFilter({ value = '', onChange }) {
  const { data: heroes = [], isLoading } = useHeroOptions()

  return (
    <div style={{ position: 'relative' }}>
      <span className="material-symbols-outlined" style={{
        position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
        fontSize: 16, color: 'rgba(61,43,26,0.4)', pointerEvents: 'none',
      }}>
        person_search
      </span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={isLoading}
        className="input-gold cursor-pointer"
        style={{ height: 40, paddingLeft: 30, paddingRight: 28, fontSize: '0.85rem', minWidth: 180 }}
      >
        <option value="">Tất cả anh hùng</option>
        {heroes.map(h => (
          <option key={h.id} value={h.id}>{h.name}</option>
        ))}
      </select>
    </div>
  )
}
