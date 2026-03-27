import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { Pagination } from '../components/Pagination'
import { SearchField } from '../components/SearchField'
import { StatusPanel } from '../components/StatusPanel'
import { fetchTeams, getTeamSearchText } from '../api/soccerStat'
import {
  clampPage,
  filterBySearch,
  getTotalPages,
  paginateItems,
} from '../utils/list'

const PAGE_SIZE = 12

function getPageFromSearchParams(searchParams: URLSearchParams) {
  const pageValue = Number(searchParams.get('page') ?? '1')

  return Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 1
}

export function TeamsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchValue = searchParams.get('search') ?? ''

  const teamsQuery = useQuery({
    queryKey: ['teams'],
    queryFn: fetchTeams,
  })

  const filteredTeams = filterBySearch(
    teamsQuery.data ?? [],
    searchValue,
    getTeamSearchText,
  )
  const totalPages = getTotalPages(filteredTeams.length, PAGE_SIZE)
  const currentPage = clampPage(getPageFromSearchParams(searchParams), totalPages)
  const visibleTeams = paginateItems(filteredTeams, currentPage, PAGE_SIZE)

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
    <section className="page page--catalog">
      <div className="catalog-toolbar">
        <SearchField
          className="search-field--catalog"
          label="Поиск по командам"
          placeholder="Search"
          value={searchValue}
          onChange={updateSearch}
          hideLabel
        />
      </div>

      {teamsQuery.isLoading ? (
        <StatusPanel
          title="Загружаем команды"
          description="Получаем список команд из football-data.org."
        />
      ) : null}

      {teamsQuery.isError ? (
        <StatusPanel
          title="Не удалось загрузить команды"
          description={teamsQuery.error.message}
        />
      ) : null}

      {!teamsQuery.isLoading &&
      !teamsQuery.isError &&
      visibleTeams.length === 0 ? (
        <StatusPanel
          title="Ничего не найдено"
          description="Попробуй сократить запрос или проверить написание названия команды."
        />
      ) : null}

      {!teamsQuery.isLoading && !teamsQuery.isError && visibleTeams.length > 0 ? (
        <>
          <div className="catalog-grid">
            {visibleTeams.map((team) => (
              <Link
                key={team.id}
                to={`/teams/${team.id}`}
                className="catalog-card catalog-card--team"
              >
                <div className="catalog-card__image catalog-card__image--team">
                  {team.crest ? (
                    <img
                      src={team.crest}
                      alt={`Логотип ${team.name}`}
                      loading="lazy"
                    />
                  ) : (
                    <span className="catalog-card__fallback">
                      {team.tla || team.name.slice(0, 3)}
                    </span>
                  )}
                </div>

                <div className="catalog-card__body">
                  <p className="catalog-card__title catalog-card__title--team">
                    {team.name}
                  </p>
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
