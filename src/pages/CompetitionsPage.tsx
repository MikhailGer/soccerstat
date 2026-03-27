import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { Pagination } from '../components/Pagination'
import { SearchField } from '../components/SearchField'
import { StatusPanel } from '../components/StatusPanel'
import {
  fetchCompetitions,
  getCompetitionSearchText,
} from '../api/soccerStat'
import {
  clampPage,
  filterBySearch,
  getTotalPages,
  paginateItems,
} from '../utils/list'

const PAGE_SIZE = 8

function getPageFromSearchParams(searchParams: URLSearchParams) {
  const pageValue = Number(searchParams.get('page') ?? '1')

  return Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 1
}

export function CompetitionsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchValue = searchParams.get('search') ?? ''

  const competitionsQuery = useQuery({
    queryKey: ['competitions'],
    queryFn: fetchCompetitions,
  })

  const filteredCompetitions = filterBySearch(
    competitionsQuery.data ?? [],
    searchValue,
    getCompetitionSearchText,
  )
  const totalPages = getTotalPages(filteredCompetitions.length, PAGE_SIZE)
  const currentPage = clampPage(getPageFromSearchParams(searchParams), totalPages)
  const visibleCompetitions = paginateItems(
    filteredCompetitions,
    currentPage,
    PAGE_SIZE,
  )

  function updateSearch(nextSearchValue: string) {
    const nextSearchParams = new URLSearchParams(searchParams)

    if (nextSearchValue.trim()) {
      nextSearchParams.set('search', nextSearchValue)
    } else {
      nextSearchParams.delete('search')
    }

    nextSearchParams.delete('page')
    setSearchParams(nextSearchParams)
  }

  function updatePage(nextPage: number) {
    const nextSearchParams = new URLSearchParams(searchParams)

    if (nextPage <= 1) {
      nextSearchParams.delete('page')
    } else {
      nextSearchParams.set('page', String(nextPage))
    }

    setSearchParams(nextSearchParams)
  }

  return (
    <section className="page">
      <div className="page__header">
        <span className="page__eyebrow">Раздел 1</span>
        <h1>Лиги</h1>
        <p>
          Просматривай соревнования, фильтруй список по названию и переходи к
          календарю выбранной лиги.
        </p>
      </div>

      <div className="page__toolbar">
        <SearchField
          label="Поиск по лигам"
          placeholder="Например, Premier League"
          value={searchValue}
          onChange={updateSearch}
        />

        <p className="page__meta">
          Найдено: <strong>{filteredCompetitions.length}</strong>
        </p>
      </div>

      {competitionsQuery.isLoading ? (
        <StatusPanel
          title="Загружаем лиги"
          description="Получаем список соревнований из football-data.org."
        />
      ) : null}

      {competitionsQuery.isError ? (
        <StatusPanel
          title="Не удалось загрузить лиги"
          description={competitionsQuery.error.message}
        />
      ) : null}

      {!competitionsQuery.isLoading &&
      !competitionsQuery.isError &&
      visibleCompetitions.length === 0 ? (
        <StatusPanel
          title="Ничего не найдено"
          description="Попробуй изменить поисковый запрос и проверить написание названия."
        />
      ) : null}

      {!competitionsQuery.isLoading &&
      !competitionsQuery.isError &&
      visibleCompetitions.length > 0 ? (
        <>
          <div className="card-grid">
            {visibleCompetitions.map((competition) => (
              <Link
                key={competition.id}
                to={`/competitions/${competition.id}`}
                className="card"
              >
                <div className="card__logo">
                  {competition.emblem ? (
                    <img
                      src={competition.emblem}
                      alt={`Эмблема ${competition.name}`}
                      loading="lazy"
                    />
                  ) : (
                    <span>{competition.code}</span>
                  )}
                </div>

                <div className="card__body">
                  <p className="card__title">{competition.name}</p>
                  <p className="card__subtitle">{competition.area.name}</p>
                </div>
              </Link>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={updatePage}
          />
        </>
      ) : null}
    </section>
  )
}
