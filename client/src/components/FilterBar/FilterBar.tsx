import { setDirectionFilter, setTypeFilter } from '../../store/feedSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import type { PostDirection, PostType } from '../../types/post'
import './FilterBar.scss'

const typeOptions: Array<PostType | 'Все'> = ['Все', 'Контент', 'Событие', 'Вакансия']
const directionOptions: Array<PostDirection | 'Все'> = [
  'Все',
  'Frontend',
  'Backend',
  'QA',
  'Design',
  'Management',
  'HR',
]

export function FilterBar() {
  const dispatch = useAppDispatch()
  const filters = useAppSelector((state) => state.feed.filters)

  return (
    <div className="filter-bar">
      <div className="filter-bar__group">
        <label className="filter-bar__label" htmlFor="postType">
          Тип поста
        </label>

        <select
          id="postType"
          className="filter-bar__select"
          value={filters.type}
          onChange={(e) => dispatch(setTypeFilter(e.target.value as PostType | 'Все'))}
        >
          {typeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-bar__group">
        <label className="filter-bar__label" htmlFor="postDirection">
          Направление
        </label>

        <select
          id="postDirection"
          className="filter-bar__select"
          value={filters.direction}
          onChange={(e) =>
            dispatch(setDirectionFilter(e.target.value as PostDirection | 'Все'))
          }
        >
          {directionOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}