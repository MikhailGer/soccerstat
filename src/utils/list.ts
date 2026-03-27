export function normalizeSearchValue(value: string) {
  return value.trim().toLocaleLowerCase('ru-RU')
}

export function filterBySearch<T>(
  items: T[],
  searchValue: string,
  getSearchableText: (item: T) => string,
) {
  const normalizedSearchValue = normalizeSearchValue(searchValue)

  if (!normalizedSearchValue) {
    return items
  }

  return items.filter((item) =>
    normalizeSearchValue(getSearchableText(item)).includes(normalizedSearchValue),
  )
}

export function getTotalPages(totalItems: number, pageSize: number) {
  return Math.max(1, Math.ceil(totalItems / pageSize))
}

export function clampPage(page: number, totalPages: number) {
  return Math.min(Math.max(page, 1), totalPages)
}

export function paginateItems<T>(items: T[], page: number, pageSize: number) {
  const startIndex = (page - 1) * pageSize

  return items.slice(startIndex, startIndex + pageSize)
}
