import { Link } from 'react-router-dom'

interface BreadcrumbItem {
  label: string
  to?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="breadcrumbs" aria-label="Хлебные крошки">
      {items.map((item, index) => {
        const isLastItem = index === items.length - 1

        return (
          <span key={`${item.label}-${index}`} className="breadcrumbs__item">
            {item.to && !isLastItem ? (
              <Link to={item.to} className="breadcrumbs__link">
                {item.label}
              </Link>
            ) : (
              <span className="breadcrumbs__current">{item.label}</span>
            )}

            {!isLastItem ? <span className="breadcrumbs__separator">/</span> : null}
          </span>
        )
      })}
    </nav>
  )
}
