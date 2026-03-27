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
    <section className="page">
      <div className="page__header">
        <span className="page__eyebrow">Раздел 2</span>
        <h1>Команды</h1>
        <p>
          Список команд с локальным поиском, пагинацией и переходом к календарю
          выбранной команды.
        </p>
      </div>

      <div className="page__toolbar">
        <SearchField
          label="Поиск по командам"
          placeholder="Например, Borussia Dortmund"
          value={searchValue}
          onChange={updateSearch}
        />

        <p className="page__meta">
          Найдено: <strong>{filteredTeams.length}</strong>
        </p>
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
          <div className="card-grid card-grid--teams">
            {visibleTeams.map((team) => (
              <Link key={team.id} to={`/teams/${team.id}`} className="card">
                <div className="card__logo">
                  {team.crest ? (
                    <img
                      src={team.crest}
                      alt={`Логотип ${team.name}`}
                      loading="lazy"
                    />
                  ) : (
                    <span>{team.tla}</span>
                  )}
                </div>

                <div className="card__body">
                  <p className="card__title">{team.name}</p>
                  <p className="card__subtitle">
                    {team.shortName || team.venue || 'Команда'}
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
