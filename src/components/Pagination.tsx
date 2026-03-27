interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  return (
    <nav className="pagination" aria-label="Пагинация">
      <button
        type="button"
        className="pagination__button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Назад
      </button>

      <div className="pagination__pages">
        {Array.from({ length: totalPages }, (_, index) => {
          const page = index + 1

          return (
            <button
              key={page}
              type="button"
              className={
                page === currentPage
                  ? 'pagination__button pagination__button--active'
                  : 'pagination__button'
              }
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        className="pagination__button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Вперёд
      </button>
    </nav>
  )
}
