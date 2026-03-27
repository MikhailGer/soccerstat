import { useQuery } from '@tanstack/react-query'
import { useParams, useSearchParams } from 'react-router-dom'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { DateRangeFilter } from '../components/DateRangeFilter'
import { MatchesList } from '../components/MatchesList'
import { Pagination } from '../components/Pagination'
import { StatusPanel } from '../components/StatusPanel'
import { fetchTeam, fetchTeamMatches } from '../api/soccerStat'
import { clampPage, getTotalPages, paginateItems } from '../utils/list'

const PAGE_SIZE = 10

function getPageFromSearchParams(searchParams: URLSearchParams) {
  const pageValue = Number(searchParams.get('page') ?? '1')

  return Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 1
}

export function TeamMatchesPage() {
  const { teamId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const dateFrom = searchParams.get('dateFrom') ?? undefined
  const dateTo = searchParams.get('dateTo') ?? undefined

  const teamQuery = useQuery({
    queryKey: ['team', teamId],
    queryFn: () => fetchTeam(teamId ?? ''),
    enabled: Boolean(teamId),
  })

  const teamMatchesQuery = useQuery({
    queryKey: ['teamMatches', teamId, dateFrom, dateTo],
    queryFn: () => fetchTeamMatches(teamId ?? '', { dateFrom, dateTo }),
    enabled: Boolean(teamId),
  })

  const totalPages = getTotalPages(teamMatchesQuery.data?.matches.length ?? 0, PAGE_SIZE)
  const currentPage = clampPage(getPageFromSearchParams(searchParams), totalPages)
  const visibleMatches = paginateItems(
    teamMatchesQuery.data?.matches ?? [],
    currentPage,
    PAGE_SIZE,
  )

  function updateDateRange(nextDateRange: {
    dateFrom?: string
    dateTo?: string
  }) {
    const nextSearchParams = new URLSearchParams(searchParams)

    nextSearchParams.delete('page')

    if (nextDateRange.dateFrom && nextDateRange.dateTo) {
      nextSearchParams.set('dateFrom', nextDateRange.dateFrom)
      nextSearchParams.set('dateTo', nextDateRange.dateTo)
    } else {
      nextSearchParams.delete('dateFrom')
      nextSearchParams.delete('dateTo')
    }

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

  if (!teamId) {
    return (
      <section className="page">
        <StatusPanel
          title="Не найдена команда"
          description="В адресе отсутствует идентификатор команды."
        />
      </section>
    )
  }

  const teamName = teamQuery.data?.name ?? 'Календарь команды'

  return (
    <section className="page">
      <Breadcrumbs
        items={[{ label: 'Команды', to: '/teams' }, { label: teamName }]}
      />

      <div className="page__header page__header--compact">
        <span className="page__eyebrow">Раздел 4</span>
        <h1>{teamName}</h1>
        <p>
          Матчи команды с фильтрацией по датам, переводом времени в локальную
          таймзону пользователя и отображением статусов на русском.
        </p>
      </div>

      <div className="page__toolbar page__toolbar--stacked">
        <DateRangeFilter
          key={`${dateFrom ?? 'empty'}-${dateTo ?? 'empty'}`}
          appliedDateFrom={dateFrom}
          appliedDateTo={dateTo}
          onApply={updateDateRange}
        />
        <p className="page__meta">
          Матчей: <strong>{teamMatchesQuery.data?.total ?? 0}</strong>
        </p>
      </div>

      {teamQuery.isError ? (
        <StatusPanel
          title="Не удалось загрузить команду"
          description={teamQuery.error.message}
        />
      ) : null}

      {teamMatchesQuery.isLoading ? (
        <StatusPanel
          title="Загружаем календарь команды"
          description="Получаем матчи выбранной команды."
        />
      ) : null}

      {teamMatchesQuery.isError ? (
        <StatusPanel
          title="Не удалось загрузить календарь команды"
          description={teamMatchesQuery.error.message}
        />
      ) : null}

      {!teamMatchesQuery.isLoading &&
      !teamMatchesQuery.isError &&
      visibleMatches.length === 0 ? (
        <StatusPanel
          title="Матчи не найдены"
          description="Попробуй изменить диапазон дат или сбросить фильтр."
        />
      ) : null}

      {!teamMatchesQuery.isLoading &&
      !teamMatchesQuery.isError &&
      visibleMatches.length > 0 ? (
        <>
          <MatchesList matches={visibleMatches} showCompetition />
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
